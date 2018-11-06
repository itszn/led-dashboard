import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    }
});

class DrawerSettings extends React.Component {
    state = {
        powered: window.manager.power
    };

    handleTogglePower = () => {
        let np = !this.state.powered;
        this.setState({
            powered: np
        });
        let mode = (np? 'on' : 'off');
        $.ajax({
            method:'PATCH',
            url:`${window.URL}/power/${mode}`,
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                <ListItem button onClick={this.handleTogglePower}>
                    <ListItemText primary="Power" />
                    <ListItemSecondaryAction>
                        <Switch
                            onChange={this.handleTogglePower}
                            checked={this.state.powered}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                </List>
            </div>
        );

    }
}

export default withStyles(styles)(DrawerSettings)
