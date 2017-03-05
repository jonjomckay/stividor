import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

class Loadable extends Component {
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

Loadable.propTypes = {
    loading: React.PropTypes.bool.isRequired
};

export default Loadable;