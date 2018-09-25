import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { ModuleWrapper } from "./modules.js";

const styles = {
    card: {
        marginBottom: 20,
    }
}

class ZoneInfo_ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            module: this.props.zone.module,
            name: this.props.zone.name,
            timeout: null
        };
    }

    changeModule = (event) => {
        let modName = event.target.value
        let mod = window.manager.modules[modName];
        let zone = this.props.zone;
        this.setState({ module: modName });
        if (zone.pastSettings === undefined) {
            zone.pastSettings = {};
        }
        zone.pastSettings[zone.module] = {
            settings: zone.settings,
            allow_dbus: zone.allow_dbus
        }
        zone.module = modName;
        if (modName in zone.pastSettings) {
            zone.settings = zone.pastSettings[modName].settings;
            zone.allow_dbus = zone.pastSettings[modName].allow_dbus;
        } else {
            zone.settings = $.extend(true, {}, mod.settings);
            zone.allow_dbus = mod.allow_dbus;
        }
        this.props.redraw();
        this.props.update();
        zones_instance.forceUpdate();
    }

    changeZoneName = (event) => {
        let name = event.target.value;
        let zone = this.props.zone;

        this.state.name = name
        if (this.state.timeout !== null)
            clearTimeout(this.state.timeout);
        this.state.timeout = setTimeout(this.update,1000);
        this.setState(this.state);
    }

    update = () => {
        this.setState({timeout: null});
        // TODO check if valid
        this.props.zone.name = this.state.name;
        this.props.update();
        zones_instance.forceUpdate();
    }

    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
            <CardContent>
                <FormControl className={classes.formControl}>
                <div>
                <FormGroup row key="name">
                <TextField
                    label="Zone Name"
                    value={this.state.name}
                    onChange={this.changeZoneName}
                    className={classes.textField}
                    margin="normal"
                />
                </FormGroup>
                </div>
                <InputLabel htmlFor="module">Animation</InputLabel>
                <Select
                    value={this.state.module}
                    onChange={this.changeModule}
                    inputProps={{
                        id:"module"
                    }}
                >
                {Object.values(window.manager.modules).map(m => (
                    <MenuItem value={m.name} key={m.name}>{m.name}</MenuItem>
                ))}
                </Select>
                </FormControl>
            </CardContent>
            </Card>
        );
    }
}

const ZoneInfo = withStyles(styles)(ZoneInfo_);


class ZoneControl extends React.Component {
    redraw = () => {
        this.forceUpdate()
    }
    updateZone = (settings) => {
        let zone = this.props.zone;
        if (settings !== undefined) 
            zone.settings=settings;
        if (zone.settings.step_delay !== undefined)
            zone.step_delay = zone.settings.step_delay;

        $.ajax({
            method:'PATCH',
            url:`${window.URL}/zone/${zone.id}`,
            data: JSON.stringify({
                zone: {
                    id: ''+zone.id,
                    name: zone.name,
                    length: zone.leds,
                    module: zone.module,
                    settings: zone.settings,
                    allow_dbus: zone.allow_dbus,
                    step_delay: zone.step_delay
                }
            }),
        });
    }

    render() {
        const { classes, zone } = this.props;
        return (
            <div>
            <ZoneInfo
                key={'info'+zone.id+zone.module}
                zone={zone}
                redraw={this.redraw}
                update={this.updateZone}
            />
            {(zone && zone.module && zone.module !== 'blank')?
            <ModuleWrapper
                key={'module'+zone.id+zone.module}
                type={zone.module}
                settings={zone.settings}
                zone={zone}
                updateZone={this.updateZone}
            /> : null}
            </div>
        );
    }
}


export default ZoneControl
