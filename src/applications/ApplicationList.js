import React, { Component } from 'react';
import { Link } from 'react-router-component';
import { Grid, Header, List } from 'semantic-ui-react';
import Loadable from '../Loadable';
import Github from "../Github";
import ApplicationListItem from './ApplicationListItem';
import Kubernetes from "../Kubernetes";

export default class ApplicationList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applications: [],
            namespaces: [],
            loading: true
        };
    }

    componentDidMount = () => {
        Github.fetchTemplateContents('').then(response => {
            const applications = response.items
                .filter(item => item.type === 'dir')
                .map(item => item.name);

            this.setState({
                applications: applications,
                loading: false
            })
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
                <List.Item key={ application }>
                    <List.Content>
                        <ApplicationListItem application={ application } namespaces={ this.state.namespaces } />
                    </List.Content>
                </List.Item>
            );
        });

        return (
            <Loadable loading={ this.state.loading }>
                <List relaxed animated>
                    { applications }
                </List>
            </Loadable>
        );
    }
}