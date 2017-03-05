import React, { Component } from 'react';
import { Accordion, Button, Input, Item, Label, Table } from 'semantic-ui-react';

export default class ContainerItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            configuration: []
        };
    }

    componentWillReceiveProps = (nextProps) => {
        const configuration = nextProps.container.env
            .filter(env => env.valueFrom.configMapKeyRef)
            .map(env => env.valueFrom.configMapKeyRef.key)
            .map(key => {
                return {
                    name: key,
                    value: nextProps.configMap.data[key]
                };
            });

        this.setState({
            configuration: configuration
        });
    };

    onConfigurationChange = (event) => {

    };

    render() {
        var container = this.props.container;

        const ports = container.ports.map(port => {
            return (
                <Label key={ port.containerPort }>
                    <span>Port</span>
                    <Label.Detail>{ port.containerPort }</Label.Detail>
                </Label>
            );
        });

        const configuration = this.state.configuration.map(configuration => {
            return (
                <Table.Row key={ configuration.name }>
                    <Table.Cell width={ 6 }>{ configuration.name }</Table.Cell>
                    <Table.Cell width={ 10 }>
                        <Input fluid value={ configuration.value || '' } onChange={ this.onConfigurationChange } />
                    </Table.Cell>
                </Table.Row>
            )
        });

        return (
            <Item>
                <Item.Content verticalAlign="middle">
                    <Item.Header>{ container.name }</Item.Header>

                    <Item.Description>
                        <Label>
                            <span>Pull Policy</span>
                            <Label.Detail>{ container.imagePullPolicy }</Label.Detail>
                        </Label>

                        { ports }

                        <Label>
                            <span>Memory (Limits)</span>
                            <Label.Detail>{ container.resources.limits.memory }</Label.Detail>
                        </Label>

                        <Label>
                            <span>Memory (Requests)</span>
                            <Label.Detail>{ container.resources.requests.memory }</Label.Detail>
                        </Label>
                    </Item.Description>

                    <Item.Extra>
                        <Accordion>
                            <Accordion.Title>
                                <Button content="Edit Configuration" size="tiny" color="blue" />
                            </Accordion.Title>
                            <Accordion.Content>
                                <Table>
                                    <Table.Body>
                                        { configuration }
                                    </Table.Body>
                                </Table>
                            </Accordion.Content>
                        </Accordion>
                    </Item.Extra>
                </Item.Content>
            </Item>
        );
    }
}