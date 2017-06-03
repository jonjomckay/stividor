import React, { Component } from 'react';

import ContainerField from './ContainerField';
import Kubernetes from '../../clients/Kubernetes';
import TemplateService from '../TemplateService';

class Step3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            containers: [],
            existingContainers: [],
            loading: true
        };
    }

    componentDidMount = () => {
        Kubernetes.fetchDeploymentByNamespace(this.props.namespace, this.props.application, (err, response) => {
            if (response) {
                const existingContainers = response.spec.template.spec.containers.map(container => {
                    return container;
                });

                this.setState({ existingContainers: existingContainers });
            }

            // Now load the deployment template from GitHub
            TemplateService.fetchDeploymentTemplate(this.props.application).then(template => {
                const containers = template.spec.template.spec.containers.map(container => {
                    return container;
                });

                this.setState({ containers: containers });
            }).then(() => {
                this.setState({ loading: false });
            });
        });
    };

    onChangeImage = (name, image) => {
        const containers = this.state.containers.map(container => {
            if (container.name === name) {
                container.image = image;
            }

            return container;
        });

        this.setState({
            containers: containers
        });

        this.props.onChangeContainers(containers);
    };

    render() {
        const containers = this.state.containers.map(container => {
            const existingContainer = this.state.existingContainers.find(e => e.name === container.name);

            return (
                <ContainerField image={ existingContainer.image }
                                key={ container.name }
                                name={ container.name }
                                onChangeImage={ this.onChangeImage }/>
            );
        });

        return (
            <div>
                { containers }
            </div>
        );
    }
}

export default Step3;