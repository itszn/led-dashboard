import * as React from 'react'
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
const update = require('immutability-helper')
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles';

import Card from './card'
import ZoneControl from "./zoneAddDelete.js";

const styles = {
    zoneWrapper: {
        width: '100%'
    },
    emtpyCard: {
        height: 80
    }
};


const emptyTarget = {
    hover(props, monitor, component) {
        if (!component) {
            return null;
        }
        const dragIndex = monitor.getItem().index;
        props.moveCard(dragIndex, 0);
        monitor.getItem().index = 0;
    }
};
class EmptyDrop_ extends React.Component {
    render() {
        const {
            noCards,
            classes,
            connectDropTarget
        } = this.props;
        if (noCards) {
            return;
        }

        return (connectDropTarget && (
            connectDropTarget(
				<div>
                    <Paper elevation={0} className={classes.emtpyCard}>
                    Empty
                    </Paper>
				</div>
            )
        ));
    }
}
let EmptyDrop = withStyles(styles)(DropTarget('card', emptyTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))(EmptyDrop_));

class Zones extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cards: this.props.cards
        }
        this.leds = 240;
        for (let c of this.state.cards) {
            c.leds = c.length;
        }

        /*
        let leds_left = this.leds;
        let leds_each = ~~(this.leds/this.state.cards.length);
            if (leds_each*2 > leds_left)
                leds_each = leds_left
            c.leds = leds_each;
            leds_left -= leds_each;
            c.locked = false;
        }
        */

    }

    resizeZone = (card, new_height) => {
        let zone = this.state.cards[card.props.index];
        let old_leds = zone.leds;
        let new_leds = (new_height-80)/2;
        if (old_leds === new_leds)
            return;

        if (new_leds < old_leds) {
            let next_index = card.props.index;
            while (true) {
                next_index++;
                if (next_index === this.state.cards.length)
                    return;
                let next_zone = this.state.cards[next_index];
                if (next_zone.locked)
                    continue;
                this.setState(
                    update(this.state, {
                        cards: {[next_index]: {leds: 
                            {$set: next_zone.leds + (old_leds - new_leds)}
                        }}
                    })
                )
                break;
            }
        } else {
            let delta = new_leds - old_leds;
            let next_index = card.props.index;
            while (delta > 0) {
                next_index++;
                if (next_index === this.state.cards.length)
                    return;
                let next_zone = this.state.cards[next_index];
                if (next_zone.leds === 0 || next_zone.locked)
                    continue;

                let delta_allowed = delta > next_zone.leds ? next_zone.leds : delta;
                this.setState(
                    update(this.state, {
                        cards: {[next_index]: {leds: 
                            {$set: next_zone.leds - delta_allowed}
                        }}
                    })
                )
                delta -= delta_allowed;
            }
        }

        this.setState(
            update(this.state, {
                cards: {[card.props.index]: {leds: 
                    {$set: new_leds}
                }}
            })
        )

    }

    updateZones = () => {
        let order = [];
        let sizes = [];
        for (let z of this.state.cards) {
            order.push(z.id);
            sizes.push(z.leds);
        }
        $.ajax({
            method:'PATCH',
            url:`${window.URL}/zones/order`,
            data: JSON.stringify({
                'order':order,
                'sizes':sizes
            })
        });
    }

    lockZone = (card) => {
        let zone = this.state.cards[card.props.index];
        this.setState(
            update(this.state, {
                cards: {[card.props.index]: {$toggle: ['locked']}}
            })
        );
    }

    render() {
        const { classes } = this.props;
        const { cards } = this.state;

        let cardlist = null;
        if (cards.length == 0) {
            cardlist = (
                <div className={classes.zoneWrapper}>
                <EmptyDrop moveCard={this.moveCard}/>
                </div>
            )
        } else {
            cardlist = (
                <div className={classes.zoneWrapper}>
                    {cards.map((card, i) => (
                        <Card
                            key={card.id}
                            index={i}
                            zone={card}
                            moveCard={this.moveCard}
                            height={card.leds*2+80}
                            resizeZone={this.resizeZone}
                            last={i === cards.length-1}
                            lockZone={this.lockZone}
                            selected={this.props.selected===card.id}
                            selectZone={this.props.selectZone}
                            updateZones={this.updateZones}
                            addZone={this.addZone}
                            removeZone={this.removeZone}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div>
            <ZoneControl removeCard={this.removeCard}/>
            {cardlist}
            </div>
        )
    }

    removeCard = (index) => {
        const old_zone = this.state.cards[index];
        this.setState(
            update(this.state, {
                cards: {
                    $splice: [[index, 1]],
                },
            }),
        );
        let next_index = index;
        while (next_index < this.state.cards.length) {
            let next_zone = this.state.cards[next_index];
            if (next_zone.locked && nextIndex != this.state.cards.length-1) {
                next_index++;
                continue;
            }
            console.log(next_zone);
            this.setState(
                update(this.state, {
                    cards: {[next_index]: {leds: 
                        {$set: next_zone.leds + old_zone.leds}
                    }}
                })
            )
            break;
        }
    }

    removeZone = (index) => {
        let zone = this.state.cards[index];
        this.props.removeZone(zone.id);
        this.removeCard(index);

        let order = [];
        let sizes = [];
        for (let z of this.state.cards) {
            order.push(z.id);
            sizes.push(z.leds);
        }

        $.ajax({
            method:'DELETE',
            url:`${window.URL}/zone/${zone.id}`,
            data: JSON.stringify({
                'order': order,
                'sizes': sizes
            })
        });
    }

    addZone = (index) => {
        let order = [];
        let sizes = [];
        for (let z of this.state.cards) {
            order.push(z.id);
            sizes.push(z.leds);
        }

        let zone = this.state.cards[index];
        this.props.addZone(zone.id, zone);

        $.ajax({
            method:'PUT',
            url:`${window.URL}/zones`,
            data: JSON.stringify({
                'zone': zone,
                'order': order,
                'sizes': sizes
            })
        });
    }

    moveCard = (dragIndex, hoverIndex) => {
        const { cards } = this.state;
        if (dragIndex == -1) {
            const newCard = window.manager.createZoneFromModule(
                'solid',
                window.max_id.toString(),
                'zone_'+window.max_id,
                (this.state.cards.length === 0? 240 : 0));

            this.setState(
                update(this.state, {
                    cards: {
                        $splice: [[hoverIndex, 0, newCard]],
                    },
                }),
            );
            return;

        }
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

export default withStyles(styles)(Zones);
