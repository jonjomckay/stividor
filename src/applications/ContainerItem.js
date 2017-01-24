import React, { Component } from 'react';
import { Button, Item, Label } from 'semantic-ui-react';

export default class ContainerItem extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        var container = this.props.container;

        var ports = container.ports.map(port => {
            return (
                <Label key={ port.containerPort }>
                    <span>Port</span>
                    <Label.Detail>{ port.containerPort }</Label.Detail>
                </Label>
            );
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
                        <Button size="tiny" color="blue">Show</Button>
                    </Item.Extra>
                </Item.Content>
            </Item>
        );
    }
}