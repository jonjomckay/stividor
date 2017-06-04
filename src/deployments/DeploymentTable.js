import React, { Component } from 'react';
import SettingsConstants from '../settings/SettingsConstants';

export default class DeploymentTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            containers: []
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.namespace === '' || nextProps.deployment === '') {
            return;
        }


        if (this.props.namespace !== nextProps.namespace || this.props.deployment !== nextProps.deployment) {
            this.fetchDeployment(nextProps.namespace, nextProps.deployment)
                .then(response => {
                    this.setState({
                        containers: response.spec.template.spec.containers
                    });
                });
        }
    };

    fetchDeployment(namespace, deployment) {
        const request = {
            headers: {
                'Authorization': localStorage.getItem(SettingsConstants.KUBERNETES_TOKEN)
            }
        };

        return fetch(localStorage.getItem(SettingsConstants.KUBERNETES_HOST) + '/apis/apps/v1beta1/namespaces/' + namespace + '/deployments/' + deployment, request)
            .then(response => response.json());
    }

    onChangeImage = (e) => {
        const containers = this.state.containers.map(container => {
            if (container.name === e.target.name) {
                container.image = e.target.value;
            }

            return container;
        });

        this.setState({
            containers: containers
        });

        this.props.onChange(containers);
    };

    render() {
        const containers = this.state.containers.map(container => {
            return (
                <tr key={ container.name }>
                    <td className="w50">{ container.name }</td>
                    <td className="w50">
                        <input type="text" name={ container.name } onChange={ this.onChangeImage } value={ container.image } />
                    </td>
                </tr>
            )
        });

        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    { containers }
                </tbody>
            </table>
        );
    }
}