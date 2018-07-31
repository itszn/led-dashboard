import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    }
});

class SaveLayout extends React.Component {
    state = {
        expanded: false,
    };

    expand = () => {
        this.setState(state => ({expanded: !state.expanded}));
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List subheader={<ListSubheader>Zones</ListSubheader>}>
                <ListItem button disabled={true}>
                    <ListItemText primary="Save Current Zone" />
                </ListItem>
                <ListItem button onClick={this.expand}>
                    <ListItemText primary="Saved Zones" />
                    {this.state.open? (<ExpandLess />) : (<ExpandMore />)}
                </ListItem>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItem button className={classes.nested} disabled={true}>
                        <ListItemText primary="Saved Zone 1" />
                    </ListItem>
                    </List>
                </Collapse>
                </List>
            </div>
        );

    }
}

export default withStyles(styles)(SaveLayout)
