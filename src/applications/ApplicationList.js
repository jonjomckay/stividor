import React, { Component } from 'react';
import { Link } from 'react-router-component';
import Loadable from '../common/Loadable';
import Github from "../clients/Github";
import ApplicationTitle from './ApplicationTitle';
import Kubernetes from "../clients/Kubernetes";

export default class ApplicationList extends Component {
    static contextTypes = {
        addNotification: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            applications: [],
            namespaces: [],
            loading: true
        };
    }

    componentDidMount = () => {

        // Load the git ref for the master branch, so we can get the repository tree
        Github.fetchTemplateRepositoryGitReference('master').then(reference => {

            Github.fetchTemplatesTree(reference.object.sha).then(tree => {

                const ending = '/deployment.yml';

                // The list of applications is made of all directories with a "deployment.yml" folder in (depth of 1)
                const applications = tree.tree
                    .filter(item => item.path.endsWith(ending))
                    .filter(item => item.path.match('^[^/]+/[^/]+$'))
                    .map(item => item.path.replace(ending, ''));

                this.setState({
                    applications: applications,
                    loading: false
                });

            });

        });

        Kubernetes.fetchNamespaces((err, response) => {
            this.setState({
                namespaces: response.items.map(item => item.metadata.name)
            })
        });
    };

    render() {
        const applications = this.state.applications.map(application => {
            return (
                <div key={ application }>
                    <ApplicationTitle application={ application } namespaces={ this.state.namespaces } />
                </div>
            );
        });

        return (
            <Loadable loading={ this.state.loading }>
                <h1>Applications</h1>

                <div>
                    { applications }
                </div>
            </Loadable>
        );
    }
}