import React, { Component } from 'react';

export default class ContentWrapper extends Component {
    render() {
        let content;

        if (this.props.namespace || this.props.match.path === '/settings') {
            content = (
                <div className="wrapper">
                    { React.createElement(this.props.component, this.props) }
                </div>
            )
        } else {
            content = (
                <div style={{ background: 'rgba(0, 0, 0, 0.8)', height: '100%', position: 'fixed', width: '100%' }} />
            )
        }

        return content;
    }
}