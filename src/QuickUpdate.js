import React, { Component } from 'react';
import DeploymentDropdown from './deployments/DeploymentDropdown';
import DeploymentTable from './deployments/DeploymentTable';

export default class QuickUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedContainers: [],
            selectedDeployment: ''
        };
    }

    onChangeContainers = (containers) => {
        this.setState({
            selectedContainers: containers
        });
    };

    onChangeDeployment = (e) => {
        e.preventDefault();

        this.setState({
            selectedDeployment: e.target.value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();

        const patch = {
            spec: {
                template: {
                    spec: {
                        containers: this.state.selectedContainers.map(container => {
                            return {
                                name: container.name,
                                image: container.image
                            };
                        })
                    }
                }
            }
        };

        console.log('updating the namespace ' + this.props.namespace);
        console.log('updating the deployment ' + this.state.selectedDeployment);
        console.log('updating with ' + JSON.stringify(patch));
    };

    render() {
        return (
            <div>
                <h1 className="title">Quick Update</h1>

                <form className="form">
                    <h4>1. Choose a deployment</h4>
                    <DeploymentDropdown
                        namespace={ this.props.namespace }
                        onChange={ this.onChangeDeployment } />

                    <h4>2. Update container versions</h4>
                    <DeploymentTable
                        namespace={ this.props.namespace }
                        deployment={ this.state.selectedDeployment }
                        onChange={ this.onChangeContainers } />

                    <h4>3. Update Kubernetes</h4>
                    <div className="form-item">
                        <button onClick={ this.onSubmit }>Update</button>
                    </div>
                </form>
            </div>
        );
    }
}