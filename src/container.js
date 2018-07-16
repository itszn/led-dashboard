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
        this.resizeZone = this.resizeZone.bind(this)
        this.state = {
            cards: [
                {
                    id: 1,
                    text: 'Zone 1',
                },
                {
                    id: 2,
                    text: 'Zone 2',
                },
                {
                    id: 3,
                    text: 'Zone 3',
                },
                {
                    id: 4,
                    text: 'Zone 4',
                },
            ],
        }
        this.leds = 240;

        let leds_left = this.leds;
        let leds_each = ~~(this.leds/this.state.cards.length);
        for (let c of this.state.cards) {
            if (leds_each*2 > leds_left)
                leds_each = leds_left
            c.leds = leds_each;
            c.start_height = leds_each*2+30;
            leds_left -= leds_each;
        }
    }

    resizeZone(card, new_height) {
        let zone = this.state.cards[card.props.index];
        let old_leds = zone.leds;
        let new_leds = (new_height-30)/2;
        if (old_leds === new_leds)
            return;

        this.setState(
            update(this.state, {
                cards: {[card.props.index]: {leds: 
                    {$set: new_leds}
                }}
            })
        )
        if (new_leds < old_leds) {
            let last_index = this.state.cards.length-1;
            let last_zone = this.state.cards[last_index];
            this.setState(
                update(this.state, {
                    cards: {[last_index]: {leds: 
                        {$set: last_zone.leds + (old_leds - new_leds)}
                    }}
                })
            )
        } else {
            let delta = new_leds - old_leds;
            let last_index = this.state.cards.length;
            while (delta > 0) {
                last_index--;
                let last_zone = this.state.cards[last_index];
                if (last_zone.leds === 0)
                    continue;

                let delta_allowed = delta > last_zone.leds ? last_zone.leds : delta;
                this.setState(
                    update(this.state, {
                        cards: {[last_index]: {leds: 
                            {$set: last_zone.leds - delta_allowed}
                        }}
                    })
                )
                delta -= delta_allowed;
            }
        }
    }

    render() {
        const { cards } = this.state;

        return (
            <div style={style}>
                {cards.map((card, i) => (
                    <Card
                        key={card.id}
                        index={i}
                        id={card.id}
                        text={card.text}
                        moveCard={this.moveCard}
                        height={card.leds*2+30}
                        resizeZone={this.resizeZone}
                        last={i === cards.length-1}
                    />
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
