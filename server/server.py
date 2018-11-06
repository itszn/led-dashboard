import os
import json
import time

from flask import Flask, jsonify, send_from_directory, request, abort
from flask_cors import CORS
import config

app = Flask(__name__)
CORS(app)

CONFIG_LOCATION = config.CONFIG_LOCATION

#CONFIG_LOCATION = '/home/pi/.config/rgbd/config.json'

if not os.path.exists(CONFIG_LOCATION):
    raise Exception('Could not find config file at {}'.format(CONFIG_LOCATION))

class ZoneManager(object):
    def __init__(self):
        self.zones = {}
        self.zone_order = []
        self.brightness = 255
        self.power = True

        if os.path.exists('./current_zones.json'):
            with open('./current_zones.json','r') as f:
                obj = json.load(f)
            self.zones = obj['zones']
            self.zone_order = obj['zone_order']
            self.brightness = obj.get('brightness',255)
            self.power = obj.get('power',True)

    def save_zones(self):
        with open('./current_zones.json','w') as f:
            json.dump({
                'zones': self.zones,
                'zone_order': self.zone_order,
                'power': self.power,
                'brightness': self.brightness
            }, f, indent=2)

    def update_config(self):
        with open(CONFIG_LOCATION,'r') as f:
            config = json.load(f)

        zones = []
        for zone_id in self.zone_order:
            zone = self.zones[zone_id]
            zones.append({
                'name': zone['name'],
                'length': zone['length'],
                'animation': zone['module'],
                'animation_config': zone['settings'],
                'allow_dbus': zone['allow_dbus'],
                'step_delay': zone['step_delay']
            })

        config['zones'] = zones
        config['strip_config']['brightness'] = self.brightness if self.power else 0

        with open(CONFIG_LOCATION,'w') as f:
            json.dump(config, f, indent=2)
        time.sleep(1)
        os.system(config.LIGHT_CTL+' reload-conf')

    def set_zone(self, zone_id, new_zone):
        zone_id = str(zone_id)
        if not zone_id in self.zones:
            self.zones[zone_id] = {}

        zone = self.zones[zone_id]
        zone['id'] = zone_id
        zone['name'] = new_zone.get('name','zone_'+zone_id)
        #zone['length'] = new_zone.get('length',0)
        zone['module'] = new_zone.get('module','blank')
        zone['settings'] = new_zone.get('settings', {})
        zone['allow_dbus'] = new_zone.get('allow_dbus', False)
        zone['step_delay'] = new_zone.get('step_delay', 100)

    def save_and_update(self):
        self.save_zones()
        self.update_config()

zones = ZoneManager()

@app.route('/')
def index():
    return send_from_directory('../dist', 'index.html')

@app.route('/modules')
def get_modules():
    return send_from_directory('.', 'modules.json')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../dist', path)

@app.route('/zones/order', methods=['PATCH'])
def update_zone_sizes():
    data = request.get_json(force=True)

    if not 'order' in data or not 'sizes' in data:
        abort(400)

    zones.zone_order = map(str,data['order'])
    for i,s in zip(zones.zone_order, data['sizes']):
        zones.zones[i]['length'] = s

    zones.save_and_update()
    return jsonify(result=True)

@app.route('/zones', methods=['GET','PUT'])
def add_zone():
    if request.method == 'GET':
        current_zones = []
        for zone_id in zones.zone_order:
            current_zones.append(zones.zones[zone_id])

        return jsonify(zones=current_zones, brightness=zones.brightness, power=zones.power)

    data = request.get_json(force=True)

    if not 'zone' in data or not 'order' in data or not 'sizes' in data:
        abort(400)

    new_zone = data['zone']
    zones.set_zone(new_zone['id'], new_zone)

    zones.zone_order = data['order']
    for i,s in zip(zones.zone_order, data['sizes']):
        zones.zones[i]['length'] = s

    zones.save_and_update()
    return jsonify(result=True)

@app.route('/zone/<string:zone_id>', methods=['DELETE','PATCH'])
def update_zone(zone_id):
    if not zone_id in zones.zones:
        abort(404)

    if request.method == 'DELETE':
        data = request.get_json(force=True)

        if not 'order' in data or not 'sizes' in data:
            abort(400)

        del zones.zones[zone_id]

        zones.zone_order = data['order']
        for i,s in zip(zones.zone_order, data['sizes']):
            zones.zones[i]['length'] = s

        zones.save_and_update()
        return jsonify(result=True)

    data = request.get_json(force=True)

    zones.set_zone(zone_id, data['zone'])

    zones.save_and_update()
    return jsonify(result=True)

@app.route('/power/<string:value>', methods=['PATCH'])
def set_power(value):
    zones.power = (value == 'on')

    zones.save_and_update()
    return jsonify(result=True)


if __name__ == '__main__':
    app.run(debug=True, port=8082, host='0.0.0.0')
