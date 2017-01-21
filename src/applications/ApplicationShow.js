import React, { Component } from 'react';
import { Grid, List } from 'semantic-ui-react';
import yaml from 'js-yaml';
import ContainerItem from './ContainerItem';
import Github from "../Github";
import Loadable from '../Loadable';

export default class ApplicationShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            application: {
                name: '',
                containers: []
            },
            loading: true
        };
    }

    componentDidMount = () => {

        var path = this.props.application + '/deployment.yml';

        Github.fetchContents(path).then(response => {
            var content = yaml.load(atob(response.content));

            var containers = content.spec.template.spec.containers.map(container => {
                return {
                    deployment: content.metadata.name,
                    image: container.image,
                    name: container.name
                };
            });

            this.setState({
                application: {
                    name: content.metadata.name,
                    containers: containers
                },
                loading: false
            });
        });
    };

    render() {
        var containers = this.state.application.containers.map(container => {
            return (
                <ContainerItem container={ container } key={ container.name } />
            );
        });

        return (
            <Loadable loading={ this.state.loading }>
                <h1>{ this.state.application.name }</h1>

                <h3>Containers</h3>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <List divided>
                                { containers }
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Loadable>
        );
    }
}