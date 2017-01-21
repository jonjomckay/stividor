import React, { Component } from 'react';
import { Label, List } from 'semantic-ui-react';
import ContainerUpdateModal from './ContainerUpdateModal';

export default class ContainerItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true
        };
    }

    toggle = () => {
        console.log(this.state.collapsed);

        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render() {
        var container = this.props.container;

        return (
            <List.Item>
                <List.Content floated="right">
                    <Label color="blue" horizontal>{ container.image }</Label>
                </List.Content>

                <List.Content>
                    <ContainerUpdateModal container={ container } />
                </List.Content>
            </List.Item>
        );
    }
}