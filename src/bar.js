import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import SaveLayout from './saveLayout.js';
import SaveZone from './saveZone.js';
import DrawerSettings from './drawerSettings.js';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    }
};



class Bar extends React.Component {
    state = {
        open: false,
    };

    toggleDrawer = (mode) => () => {
        this.setState({
            open: mode,
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={this.toggleDrawer(!this.state.open)} className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        LED Control
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer open={this.state.open} onClose={this.toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                >
                    <div className={classes.list}>
                        <DrawerSettings/>
                        <Divider/>
                        <SaveLayout/>
                        <Divider/>
                        <SaveZone/>
                        <Divider/>
                    </div>
                </div>
            </Drawer>

            </div>
        );

    }
}

export default withStyles(styles)(Bar);

