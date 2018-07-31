import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SketchPicker } from 'react-color';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

const styles = {
    title: {
        marginBottom: 16,
        fontSize: 14
    },
    loader: {
        marginLeft: 10,
    },
    color: {
        marginLeft: 0,
        marginTop: 10,
    },
    colorLabel: {
        marginLeft: 10,
    }
};

class Module extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.settings,
            timeout: null,
            showPicker: null,
            anchorEl: null
        };
    }

    handleChange = (attr, type) => (event, value) => {
        if (type === 'color') {
            value = event.hex;
        }
        if (value === undefined) {
            value = event.target.value;
        }
        console.log(event,value,type);
        if (type === 'number') {
            value = parseInt(value);
            if (isNaN(value))
                value = 0;
        }
        this.state.settings[attr] = value
        if (this.state.timeout !== null)
            clearTimeout(this.state.timeout);
        this.state.timeout = setTimeout(this.update,1000);
        this.setState(this.state);
    }

    update = () => {
        console.log('update');
        this.setState({timeout: null});
        this.props.update(this.state.settings);
    }

    handleClick = name => event => {
        this.setState({
            showPicker: name,
            anchorEl: event.currentTarget
        });
    }

    handleClose = () => {
        this.setState({
            showPicker: null,
            anchorEl: null
        });
    }

    createAttr(name) {
        const { classes } = this.props;

        let value = this.state.settings[name];
        let type = typeof(value);
        if (type === 'string' && value.length === 7 && value[0] === '#' ) {
            type = 'color';
        }
        if (type === 'boolean') {
            return (
                <FormGroup row key={name}>
                <FormControlLabel
                    control={
						(<Switch
						  checked={value}
						  onChange={this.handleChange(name, type)}
						/>)
                    }
                    label={name}
                    
                />
                </FormGroup>
            );
        }
        if (type === 'number') {
            return (
                <FormGroup row key={name}>
                <TextField
                    label={name}
                    value={value}
                    onChange={this.handleChange(name, type)}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                </FormGroup>
            );
        }
        if (type === 'string') {
            return (
                <FormGroup row key={name}>
                <TextField
                    label={name}
                    value={value}
                    onChange={this.handleChange(name, type)}
                    className={classes.textField}
                    margin="normal"
                />
                </FormGroup>
            );
        }
        if (type === 'color') {
            return (
                <FormGroup row key={name}>
                <FormControlLabel
                    classes={{
                        root: classes.color,
                        label: classes.colorLabel
                    }}
                    control={
                        (<Button
                            variant="contained"
                            onClick={this.handleClick(name)}
                            style={{backgroundColor: value}}
                        >
                        {''}
                        </Button>)
                    }
                    label={name}
                />
                <Popover
                    open={this.state.showPicker === name}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <SketchPicker
                        color={value}
                        onChangeComplete={this.handleChange(name, type)}
                    />
                </Popover>
                </FormGroup>
            );
        }
        return null;
    }

    render() {
        const { classes } = this.props;

        let inputs = [];
        for (let attr in this.state.settings) {
            inputs.push(this.createAttr(attr));
        }

        return (
            <Card className={classes.card}>
            <CardContent>
                <Typography variant="headline" component="h2" color="textSecondary">
                { this.props.name }{
                    ((this.state.timeout === null)? null : (
                        <CircularProgress className={classes.loader} size={20} color="secondary"/>))
                }
                </Typography>
                <div>
                    {inputs}
                </div>
            </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(Module);
