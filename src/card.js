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

const card_wrapper_style = {
    paddingBottom: '10px',
    position: 'initial',
}

const card_style = {
    border: '1px dashed gray',
    //padding: '0.5rem 1rem',
    //marginBottom: '.5rem',
    //margin: '10%',
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
    constructor(props) {
        super(props)
    }
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
                connectDropTarget(
                    <div>
                    <Rnd
                        size={{ width: '100px', height: this.props.height+'px' }}
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
                            right: true,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false
                        }}
                        resizeGrid={[5,5]}
                        minHeight={30}
                        maxHeight={240*2+30}
                        disableDragging={true}
                        style={{ ...card_wrapper_style}}
                    >
                    {connectDragSource(<div style={{ ...card_style, opacity }}>{text} {
                        (this.props.height-30)/5}</div>)}
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



