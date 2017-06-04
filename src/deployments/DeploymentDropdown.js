import React, { Component } from 'react';
import SettingsConstants from '../settings/SettingsConstants';

export default class DeploymentDropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deployments: [],
            namespace: ''
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.namespace !== nextProps.namespace) {
            this.fetchDeployments(nextProps.namespace)
                .then(response => {
                    this.setState({
                        deployments: response.items
                    });
                });
        }
    };

    fetchDeployments(namespace) {
        const request = {
            headers: {
                'Authorization': localStorage.getItem(SettingsConstants.KUBERNETES_TOKEN)
            }
        };

        return fetch(localStorage.getItem(SettingsConstants.KUBERNETES_HOST) + '/apis/apps/v1beta1/namespaces/' + namespace + '/deployments', request)
            .then(response => response.json());
    }

    render() {
        const options = this.state.deployments.map(deployment => {
            return (
                <option key={ deployment.metadata.name } value={ deployment.metadata.name }>
                    { deployment.metadata.name }
                </option>
            )
        });

        return (
            <div className="form-item">
                <select className="big" onChange={ this.props.onChange }>
                    <option disabled="disabled" selected="true">Choose a deployment</option>
                    { options }
                </select>
            </div>
        );
    }
}