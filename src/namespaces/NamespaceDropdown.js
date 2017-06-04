import React, { Component } from 'react';
import Loadable from '../Loadable';
import SettingsConstants from '../settings/SettingsConstants';

export default class NamespaceDropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            namespaces: []
        };
    }

    componentDidMount = () => {
        const request = {
            headers: {
                'Authorization': localStorage.getItem(SettingsConstants.KUBERNETES_TOKEN)
            }
        };

        fetch(localStorage.getItem(SettingsConstants.KUBERNETES_HOST) + '/api/v1/namespaces', request)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    isLoading: false,
                    namespaces: response.items
                });
            });
    };

    render() {
        const namespaceOptions = this.state.namespaces.map(namespace => {
            return (
                <option key={ namespace.metadata.name } value={ namespace.metadata.name }>
                    { namespace.metadata.name }
                </option>
            )
        });

        return (
            <Loadable isLoading={ this.state.isLoading }>
                <select onChange={ this.props.onChange }>
                    <option disabled="disabled" selected="true">Choose a namespace</option>
                    { namespaceOptions }
                </select>
            </Loadable>
        );
    }
}