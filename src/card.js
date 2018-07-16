import * as React from 'react'
import { findDOMNode } from 'react-dom'
import Resizable from 're-resizable'
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


const style = {
    border: '1px dashed gray',
    //padding: '0.5rem 1rem',
    //marginBottom: '.5rem',
    backgroundColor: 'white',
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

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        props.moveCard(dragIndex, hoverIndex);

        monitor.getItem().index = hoverIndex;
    },
}

class Card extends React.Component {
    render() {
        const {
            text,
            isDragging,
            connectDragSource,
            connectDropTarget,
        } = this.props;
        const opacity = isDragging ? 0 : 1;

        return (
            connectDragSource &&
            connectDropTarget &&
            connectDragSource(
                connectDropTarget(
                    <div>
                    <Resizable
                        defaultSize={{
                            width:200,
                            height:200
                        }}
                    >
                    <div style={{ ...style, opacity }}>{text}</div>
                        </Resizable></div>),
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



