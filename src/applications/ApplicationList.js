import React, { Component } from 'react';
import { Link } from 'react-router-component';
import { List } from 'semantic-ui-react';
import Loadable from '../Loadable';
import Github from "../Github";

export default class ApplicationList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applications: [],

            loading: true
        };
    }

    componentDidMount = () => {
        Github.fetchContents('').then(response => {
            const applications = response.items
                .filter(item => item.type === 'dir')
                .map(item => {
                    return {
                        name: item.name
                    }
                });

            this.setState({
                applications: applications,
                loading: false
            })
        });
    };

    render() {
        var applications = this.state.applications.map(application => {
            return (
                <List.Item key={ application.name }>
                    <List.Content>
                        <List.Header><Link href={ "/" + application.name }>{ application.name }</Link></List.Header>
                        <List.Description></List.Description>
                    </List.Content>
                </List.Item>
            );
        });

        return (
            <Loadable loading={ this.state.loading }>
                <List relaxed>
                    { applications }
                </List>
            </Loadable>
        );
    }
}