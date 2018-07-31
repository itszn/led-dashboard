import * as React from 'react'
import { findDOMNode } from 'react-dom'
import Resizable from 're-resizable'
import Rnd from 'react-rnd'
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
import { XYCoord } from 'dnd-core'

import Lock from '@material-ui/icons/Lock'
import LockOpen from '@material-ui/icons/LockOpen'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'

import style from './card.css'

const card_wrapper_style = {
    paddingBottom: '10px',
    position: 'initial',
}

const card_style = {
    cursor: 'move',
    height: '100%'
}

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    },
    endDrag(props, monitor, component) {
        const index = monitor.getItem().index;
        const id = monitor.getItem().id;
        if (!component) {
            return null;
        }
        const res = monitor.getDropResult();
        if (monitor.didDrop() && res && res.delete) {
            props.removeZone(index);
        }
    }
}

const cardTarget = {
    hover(props, monitor, component) {
        if (!component) {
            return null;
        }
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        const clientOffset = monitor.getClientOffset();

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY && dragIndex != -1) {
            return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY && dragIndex != -1) {
            return;
        }

        props.moveCard(dragIndex, hoverIndex);
        let i = monitor.getItem();
        if (i.madeCard === false) {
            i.madeCard = true;
        }

        i.index = hoverIndex;
    },
    drop(props, monitor, component) {
        if (!component) {
            return null;
        }
        const id = monitor.getItem().id;
        if (parseInt(id) == window.max_id) {
            component.props.addZone(monitor.getItem().index);
            window.max_id++;
        } else {
            component.props.updateZones();
        }
    }
}

class Card extends React.Component {
    constructor(props) {
        super(props)
    };

    selectZone = () =>  {
        this.props.selectZone(this.props.zone.id);
    }

    render() {
        const {
            selected,
            isDragging,
            connectDragSource,
            connectDropTarget,
            zone
        } = this.props;
        const opacity = isDragging ? 0 : 1;

        return (
            connectDragSource &&
            connectDropTarget &&
                connectDropTarget(
                    <div>
                    <Rnd
                        size={{ width: '100%', height: this.props.height+'px' }}
                        position={{ x: 0, y:0 }}
                        onResize={(e, direction, ref, delta, position) => {
                            /*
                            this.setState({
                                width: parseInt(ref.style.width),
                                height: parseInt(ref.style.height)
                            });
                            */
                            this.props.resizeZone(this, parseInt(ref.style.height));
                        }}
                        enableResizing={{
                            bottom: !this.props.last,
                            top: false,
                            right: false,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false
                        }}
                        resizeGrid={[2,2]}
                        minHeight={80}
                        maxHeight={240*2+80}
                        onResizeStop={this.props.updateZones}
                        disableDragging={true}
                        className={style.zoneCardWrapper}
                        style={{ ...card_wrapper_style}}
                    >
                    {connectDragSource(
                        <div style={{ ...card_style, opacity }}>
                        <Paper
                            elevation={isDragging? 1 : (selected? 2:0)}
                            className={style.zoneCard+' '+(selected? style.selectedCard : '')}
                            onClick={this.selectZone}
                        >
                            <Typography variant="headline" component="h4" style={{fontSize: 14}}>
                            <span onClick={()=>{this.props.lockZone(this)}}>
                            {(zone.locked?
                              (<Lock style={{paddingTop:10, width: '.8em', cursor: 'pointer'}}/>) :
                              (<LockOpen style={{paddingTop:10, width: '.8em', cursor: 'pointer'}}/>))
                            }
                            </span>
                            {zone.name} 
                            </Typography>
                            <Typography  component="p" style={{fontSize: 14}}>
                                Module: {zone.module}
                            </Typography>
                            <Typography  component="p" style={{fontSize: 14}}>
                                LEDs: {(this.props.height-80)/2}
                            </Typography>
                        </Paper>
                        </div>
                    )}
                        </Rnd></div>
            )
        )
    }
}

export default DropTarget('card', cardTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))
(DragSource(
    'card',
    cardSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })
)(Card));



