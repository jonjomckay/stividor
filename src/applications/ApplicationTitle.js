import React, { Component } from 'react';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';
import ApplicationDeployModal from './ApplicationDeployModal';
import ApplicationRedeployModal from './ApplicationRedeployModal';
import NamespaceChooser from '../namespaces/NamespaceChooser';

class ApplicationTitle extends Component {
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
        const templateRepoUsername = process.env.REACT_APP_GITHUB_TEMPLATE_REPO_USERNAME;
        const templateRepoName = process.env.REACT_APP_GITHUB_TEMPLATE_REPO_NAME;

        const githubLink = "https://github.com/" + templateRepoUsername + "/" + templateRepoName + "/blob/master/" + application;

        return (
            <Grid verticalAlign="middle">
                <Grid.Row>
                    <Grid.Column width={ 5 }>
                        <Header as="h3">
                            { application }

                            <Header.Subheader>
                                <a href={ githubLink }>
                                    <Icon name='github' size="small" /> { templateRepoName }/{ application }
                                </a>
                            </Header.Subheader>
                        </Header>
                    </Grid.Column>

                    <Grid.Column width={ 6 }>
                        <NamespaceChooser namespaces={ this.state.namespaces } onChange={ this.onNamespaceChange } />
                    </Grid.Column>

                    <Grid.Column width={ 5 }>
                        <Segment.Group horizontal className="basic">
                            <ApplicationDeployModal application={ application } namespace={ this.state.namespace } />
                            <ApplicationRedeployModal application={ application } namespace={ this.state.namespace } />
                        </Segment.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

ApplicationTitle.propTypes = {
    application: React.PropTypes.string.isRequired,
    namespaces: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default ApplicationTitle;