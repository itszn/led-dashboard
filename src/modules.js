import React from 'react';

import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';

import style from './modules.css';

var req = require.context("./modules", true, /^(.*\.(js$))[^.]*$/im);

class ModuleWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let Mod_body;
        try {
            Mod_body = req('./'+this.props.type+'.js').default;
        } catch (e) {
            Mod_body = req('./default.js').default;
        }
        return (
            <div className={style.moduleWrapper}>
            <Mod_body 
                key={this.props.zone.id}
                settings={this.props.settings}
                name={this.props.type}
                update={this.props.updateZone}
            />
            </div>
        );
    }

}

export { ModuleWrapper };
