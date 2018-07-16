import * as React from 'react'
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './card'
import Resizable from 're-resizable'
const update = require('immutability-helper')

const style = {
    width: 400,
}

class Container extends React.Component {
    constructor(props) {
        super(props)
        this.moveCard = this.moveCard.bind(this)
        this.state = {
            cards: [
                {
                    id: 1,
                    text: 'Test 1',
                },
                {
                    id: 2,
                    text: 'Test 2',
                },
                {
                    id: 3,
                    text: 'Test 3',
                },
                {
                    id: 4,
                    text: 'Test 4',
                },
            ],
        }
    }

    render() {
        const { cards } = this.state;

        return (
            <div style={style}>
                {cards.map((card, i) => (
                    /*<Resizable
                        defaultSize={{
                            width:200,
                            height:200
                        }}
                    >*/
                    <Card
                        key={card.id}
                        index={i}
                        id={card.id}
                        text={card.text}
                        moveCard={this.moveCard}
                    />
                    /*</Resizable>*/
                ))}
            </div>
        )
    }

    moveCard(dragIndex, hoverIndex) {
        const { cards } = this.state;
        const dragCard = cards[dragIndex];

        this.setState(
            update(this.state, {
                cards: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
                },
            }),
        )
    }
}

var backend = HTML5Backend;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    backend = TouchBackend;
}

export default DragDropContext(backend)(Container)
