import React from 'react';
import { SketchPicker } from 'react-color';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
/*    card: {
        width: 'fit-content'
    },
    */
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    picker: {
        maxWidth: 500,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    toggle: {
        maxWidth: 520,
        width: '100%',
    }

};

class Module extends React.Component {
    constructor(props) {
        super(props);
        this.settings = props.settings;
        this.state = {
            color: this.settings.color,
            power: this.settings.power
        };
    }

    handleChangeComplete = (color) => {
        this.setState({ color: color.hex });
        this.settings.color = color.hex;
        this.props.update(this.settings);
    };

    changePower = () => {
        let power = this.state.power;
        this.setState({power: !power})
        this.settings.power = !power;
        this.props.update(this.settings);
    }

    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
            <CardContent>
                <Typography variant="headline" component="h2" color="textSecondary">
                    Solid Color
                </Typography>
                <div className={classes.picker}>
                <SketchPicker
                    color={this.state.color}
                    onChangeComplete={this.handleChangeComplete}
                    disableAlpha={true}
                    width="100%"
                />
                </div>
                <div className={classes.power}>
                    <Button
                        variant={this.settings.power ? "contained" : "outlined"}
                        onClick={this.changePower}
                        className={classes.toggle}
                        color="primary"
                    >
                    Power
                    </Button>
                </div>
            </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(Module);
