import React, { Component } from 'react';
import { Grid, Header, Icon, Item, Label } from 'semantic-ui-react';
import ContainerItem from './ContainerItem';
import Loadable from '../common/Loadable';
import TemplateService from "../deployments/TemplateService";
import ApplicationTitle from './ApplicationTitle';

export default class ApplicationShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            application: {
                name: ''
            },
            deploymentTemplate: {
                metadata: {
                    name: ''
                },
                spec: {
                    replicas: '',
                    template: {
                        metadata: {
                            labels: {}
                        },
                        spec: {
                            containers: []
                        }
                    }
                }
            },
            loading: true,
            namespace: null
        };
    }

    componentDidMount = () => {
        TemplateService.fetchDeploymentTemplate(this.props.application).then(content => {
            this.setState({ deploymentTemplate: content, loading: false });
        });
    };

    onNamespaceChange = (event, data) => {
        this.setState({
            namespace: data.value
        });
    };

    render() {
        const containers = this.state.deploymentTemplate.spec.template.spec.containers.map(container => {
            return (
              <ContainerItem container={ container } key={ container.name }/>
            );
        });

        const labels = Object.keys(this.state.deploymentTemplate.spec.template.metadata.labels).map(label => {
            return (
              <Label key={ label } image color="grey">
                  <Icon name="tag"/>{ label }
                  <Label.Detail>{ this.state.deploymentTemplate.spec.template.metadata.labels[ label ] }</Label.Detail>
              </Label>
            );
        });

        return (
            <Loadable loading={ this.state.loading }>
                <ApplicationTitle application={ this.state.deploymentTemplate.metadata.name } onNamespaceChange={ this.onNamespaceChange } />

                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Label image color="blue">
                                <Icon name="grid layout" />
                                Replicas
                                <Label.Detail>{ this.state.deploymentTemplate.spec.replicas }</Label.Detail>
                            </Label>

                            { labels }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Header as="h2">
                    Containers
                    <Header.Subheader>The containers that make up this deployment <Icon circular link name='help' size="tiny" /></Header.Subheader>
                </Header>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Item.Group divided>
                                { containers }
                            </Item.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Loadable>
        );
    }
}