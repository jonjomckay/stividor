import React, { Component } from 'react';
import { Link } from 'react-router-component';
import { Grid, Header } from 'semantic-ui-react';
import ApplicationDeployModal from './ApplicationDeployModal';
import ApplicationRedeployModal from './ApplicationRedeployModal';
import NamespaceChooser from '../NamespaceChooser';

class ApplicationListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namespace: '',
            namespaces: []
        };
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            namespaces: nextProps.namespaces
        });
    };

    onNamespaceChange = (event, data) => {
        this.setState({
            namespace: data.value
        });
    };

    render() {
        const application = this.props.application;

        return (
            <Grid verticalAlign="middle">
                <Grid.Row>
                    <Grid.Column width={ 6 }>
                        <Header as="h2">
                            <Link href={ "/" + application }>{ application }</Link>
                        </Header>
                    </Grid.Column>

                    <Grid.Column width={ 6 }>
                        <NamespaceChooser namespaces={ this.state.namespaces } onChange={ this.onNamespaceChange } />
                    </Grid.Column>

                    <Grid.Column width={ 2 }>
                        <ApplicationDeployModal application={ application } namespace={ this.state.namespace } />
                    </Grid.Column>

                    <Grid.Column width={ 2 }>
                        <ApplicationRedeployModal application={ application } namespace={ this.state.namespace } />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

ApplicationListItem.propTypes = {
    application: React.PropTypes.string.isRequired,
    namespaces: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default ApplicationListItem;