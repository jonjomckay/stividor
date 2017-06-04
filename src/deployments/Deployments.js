import React, { Component } from 'react';
import Loadable from '../Loadable';
import SettingsConstants from '../settings/SettingsConstants';

export default class Deployments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deployments: [],
            isLoading: false
        };
    }

    componentDidMount = () => {
        if (this.props.namespace !== '') {
            this.fetchDeployments(this.props.namespace);
        }
    };

    componentWillReceiveProps = (nextProps) => {
        if (this.props.namespace !== nextProps.namespace) {
            this.fetchDeployments(nextProps.namespace);
        }
    };

    fetchDeployments = (namespace) => {
        const request = {
            headers: {
                'Authorization': localStorage.getItem(SettingsConstants.KUBERNETES_TOKEN)
            }
        };

        this.setState({
            isLoading: true
        });

        fetch(localStorage.getItem(SettingsConstants.KUBERNETES_HOST) + '/apis/apps/v1beta1/namespaces/' + namespace + '/deployments', request)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    deployments: response.items,
                    isLoading: false
                });
            });
    };

    render() {
        let deployments;

        if (this.state.deployments && this.state.deployments.length > 0) {
            deployments = this.state.deployments.map(deployment => {
                return (
                    <tr key={ deployment.metadata.name }>
                        <td className="w90">
                            <div className="strong">{ deployment.metadata.name }</div>
                            <div>2 containers</div>
                        </td>
                        <td className="w10">
                            <button>Update</button>
                        </td>
                    </tr>
                )
            });
        } else {
            deployments = (
                <tr>
                    <td>No deployments in this namespace</td>
                </tr>
            );
        }

        return (
            <div>
                <h1 className="title">Deployments</h1>

                <Loadable isLoading={ this.state.isLoading }>
                    <table>
                        <thead>
                            <tr>
                                <th className="w90">Name</th>
                                <th className="w10">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            { deployments }
                        </tbody>
                    </table>
                </Loadable>
            </div>
        );
    }
}