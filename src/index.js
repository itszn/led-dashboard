import React from "react";
import ReactDOM from "react-dom";

import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Zones from "./zones.js";
import Bar from './bar.js';
import ZoneControl from './zoneControl.js';


const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

/*
let zones = [
    {
        id: 1,
        name: 'Zone 1',
        module: 'solid',
        settings: {
            color: '#fff',
            power: true
        }
    },
    {
        id: 2,
        name: 'Zone 2',
    },
    {
        id: 3,
        name: 'Zone 3',
    },
    {
        id: 4,
        name: 'Zone 4',
    },
];
*/

window.URL = '';
if (location.toString().indexOf('vm') !== -1) {
    window.URL = '//vm:8082';
}

class ModuleManager {
    constructor() {
        this.modules = {};
        $.ajax({
            method: 'GET',
            url: `${window.URL}/modules`,
            success: data => {
                for (let m of data) {
                    this.modules[m.name] = m;
                }

                $.ajax({
                    method: 'GET',
                    url: `${window.URL}/zones`,
                    success: data => {
                        this.zones = data['zones'];

                        window.max_id = 0;
                        for (let z of this.zones) {
                            if (parseInt(z.id) >= window.max_id)
                                window.max_id = parseInt(z.id) + 1;
                        }
                        this.mountApp();
                    }
                });
            }
        });

    }

    createZoneFromModule = (mod_name, id, name, leds) => {
        let mod = this.modules[mod_name];
        console.log(mod_name, this.modules);
        if (mod === undefined) {
            mod = {
                settings: {},
                allow_dbus: false,
                step_delay: 100
            };
        }
        let zone = {
            leds: leds,
            name: name,
            module: mod_name,
            settings: $.extend(true, {}, mod.settings),
            allow_dbus: mod.allow_dbus,
            step_delay: mod.step_delay,
            id: id
        }
        return zone;
    }

    mountApp = () =>{
		let backend = HTML5Backend;
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			backend = TouchBackend;
		}

		let Index_ = DragDropContext(backend)(Index);
        ReactDOM.render(<Index_ zones={this.zones}/>, document.getElementById("index"));

    }
}

window.manager = new ModuleManager();




class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedZone: (this.props.zones.length > 0 ? this.props.zones[0].id : null)
        }
        this.zones = {};
        for (let z of this.props.zones){
            this.zones[z.id] = z;
        }
    }

    addZone = (id, zone) => {
        this.zones[id] = zone;
        this.setState({selectedZone: id});
    }

    removeZone = (id) => {
        if (id == this.state.selectedZone) {
            this.setState({selectedZone: null});
        }
        delete this.zones[id];
    }

    selectZone = (id) => {
        this.setState({selectedZone: id});
    }

    render() {
        let control = null;
        if (this.state.selectedZone !== null) {
            let zone = this.zones[this.state.selectedZone];
            control = (
                <ZoneControl
                    zone={zone}
                    key={zone.id+zone.module}
                />
            );
        }
        return (
            <React.Fragment>
            <MuiThemeProvider theme={theme}>
            <CssBaseline  />
            <Bar />
            <div style={{ padding: 20 }}>
            <Grid container spacing={16} >
                <Grid item sm={3} xs={4}>
                    <Zones
                        cards={this.props.zones}
                        selectZone={this.selectZone}
                        selected={this.state.selectedZone}
                        addZone={this.addZone}
                        removeZone={this.removeZone}
                        ref={function(zones) {
                            console.log(zones);
                            window.zones_instance = zones;
                        }}
                    />
                </Grid>
                <Grid item sm={9} xs={8}>
                    {control !== null ? control : ''}
                </Grid>
            </Grid>
            </div>
            </MuiThemeProvider>
            </React.Fragment>
        );
    }
}



