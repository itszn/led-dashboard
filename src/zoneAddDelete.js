import React from "react";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles';
import {
    DragSource,
    DropTarget,
    ConnectDropTarget,
    ConnectDragSource,
    DropTargetMonitor,
    DropTargetConnector,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd'
import DeleteForever from '@material-ui/icons/DeleteForever';
import AddBox from '@material-ui/icons/AddBox';


const styles = {
    newZone: {
        padding: 10,
        cursor: 'move',
        paddingLeft: 0,
        paddingRight: 0,
    },
    deleteZone: {
        padding: 10,
        paddingLeft: 0,
        paddingRight: 0,
    },
    wrapper: {
        paddingBottom: 10
    }
};

const newSource = {
    beginDrag(props) {
        return {
            id: window.max_id.toString(),
            index: -1,
            madeCard: false
        }
    },
    endDrag(props, monitor, component) {
        const i = monitor.getItem();
        const index = i.index;
        const id = i.id;

        const res = monitor.getDropResult();
        if (i.madeCard && (!monitor.didDrop()  || (res && res.delete))) {
            props.removeCard(index);
            return null;
        }
        
        // TODO check for delete
    }
}


class NewZone_ extends React.Component {
    render() {
        const {
            connectDragSource,
            classes
        } = this.props;

        return (
            connectDragSource && (
                connectDragSource(
                    <div>
                        <Paper className={classes.newZone}>
                        <Typography variant="title" style={{fontSize: 14}} align="center">
                        <AddBox />
                        </Typography>
                        </Paper>
                    </div>
                )
            )
        );

    }
}

let NewZone = withStyles(styles)(DragSource(
    'card',
    newSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })
)(NewZone_));


const deleteTarget = {
    hover(props, monitor, component) {
        if (!component) {
            return null;
        }
        return;
    },
    drop(props, monitor, component) {
        if (!component) {
            return null;
        }
        return { delete: true };
    }
}

class DeleteZone_ extends React.Component {
    render() {
        const {
            connectDropTarget,
            classes
        } = this.props;

        return (connectDropTarget && (
            connectDropTarget(
				<div>
                    <Paper className={classes.deleteZone}>
                    <Typography variant="title" style={{fontSize: 14}} align="center">
                    <DeleteForever/>
                    </Typography>
                    </Paper>
				</div>
            )
        ));
    }
}

/*
let DeleteZone = DropTarget('card', deleteTarget, (connect) =>({
    connectDropTarget: connect.dropTarget(),
}))(DeleteZone_);
*/
let DeleteZone =  withStyles(styles)(DropTarget('card', deleteTarget, (connect) =>({
    connectDropTarget: connect.dropTarget(),
}))(DeleteZone_));

class ZoneControl extends React.Component {
    render() {
        const {
            classes,
            removeCard
        } = this.props;

        return (
            <div className={classes.wrapper}>
            <Grid container spacing={16}>
            <Grid item xs={6}>
                <NewZone removeCard={removeCard} />
            </Grid>
            <Grid item xs={6}>
                <DeleteZone id="test" />
            </Grid>
            </Grid>
            </div>
        );
            
    }
}

export default withStyles(styles)(ZoneControl);
/*
export default DropTarget('card', deleteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))
(DragSource(
    'card',
    newSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })
)(ZoneControl));
//)(withStyles(styles)(ZoneControl)));
//*/

//export default withStyles(styles)(ZoneControl);

