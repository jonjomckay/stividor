import React, { Component } from 'react';
import Spinner from 'react-spinkit';

export default class Loadable extends Component {
    render() {
        let content;

        if (this.props.isLoading) {
            content = (
                <div style={{ width: '100%', height: '100%', position: 'absolute', background: 'rgba(255, 255, 255, 0.7)' }}>
                    <Spinner fadeIn="none" name="wave" style={{ position: 'absolute', left: '50%', marginTop: '7px' }} />
                </div>
            );
        }

        return (
            <div style={{ position: 'relative' }}>
                { content }
                { this.props.children }
            </div>
        );
    }
}