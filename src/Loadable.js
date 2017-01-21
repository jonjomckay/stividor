import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export default class Loadable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            loading: nextProps.loading
        });
    };

    render() {
        return (
            <div style={{ position: 'relative' }}>
                <Dimmer active={ this.state.loading } inverted>
                    <Loader inverted inline="centered">Loading</Loader>
                </Dimmer>

                { this.props.children }
            </div>
        );
    }
}