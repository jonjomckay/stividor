import React, { Component } from 'react';
import { Button, Form, Header, Icon, Modal, Table } from 'semantic-ui-react';
import deepMerge from 'deepmerge';
import Kubernetes from '../clients/Kubernetes';
import Loadable from '../common/Loadable';
import DeploymentService from "../deployments/DeploymentService";
import TemplateService from "../deployments/TemplateService";

export default class ContainerUpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applyingUpdate: false,
            errorNamespace: false,
            existingContainers: [],
            loadingContainers: true,
            namespaces: [],
            open: false,
            updateMessage: 'Update'
        };
    }

    onOpen = () => {
        Kubernetes.create().namespaces.get((err, response) => {
            const namespaces = response.items.map(namespace => {
                return {
                    name: namespace.metadata.name
                };
            });

            this.setState({
                namespaces: namespaces
            });
        });

        Kubernetes.fetchDeploymentsByName(this.props.container.deployment, (err, response) => {
            const containers = response.items.map(i => {
                // Pick a default name if the container doesn't exist (maybe it's an old deployment)
                let image = '-';

                var container = i.spec.template.spec.containers.find(c => c.name === this.props.container.name);
                if (container) {
                    image = container.image;
                }

                return {
                    namespace: i.metadata.namespace,
                    image: image
                };
            });

            this.setState({
                existingContainers: containers,
                isLoading: false
            })
        });
    };

    onSubmit = (e, { formData }) => {
        e.preventDefault();

        const container = this.props.container;

        // Reset the form validation
        this.setState({ errorNamespace: false });

        // Do some form validation
        if (formData.namespace === '') {
            this.setState({ errorNamespace: true });
            return;
        }

        this.updateStatusMessage('Fetching deployments from Kubernetes');

        // TODO: Check if the deployment exists already in the namespace in Kubernetes
        // TODO: If it doesn't then create it from the template in GitHub

        // Update the deployment from the template in GitHub
        TemplateService.fetchDeploymentTemplate(container.deployment)
            .then((res) => this.updateDeploymentFromTemplate(container, formData.image, formData.namespace, res));

        // TODO: Somehow commit the new deployment to GitHub

    };

    updateDeploymentFromTemplate = (container, image, namespace, content) => {
        const patch = {
            metadata: {
                namespace: namespace
            },
            spec: {
                template: {
                    spec: {
                        containers: [
                            {
                                name: container.name,
                                image: image
                            }
                        ]
                    }
                }
            }
        };

        var deploymentContent = deepMerge(content, patch);

        this.updateStatusMessage('Patching deployment in Kubernetes');

        // If it does then patch the deployment in the namespace with the new container
        Kubernetes.patchDeployment(namespace, container.deployment, patch, () => {
            this.updateStatusMessage('Updating deployment in Github');

            // Save the deployment into the Github deployments repository
            DeploymentService.updateGithubDeployment(container.deployment, namespace, deploymentContent).then(() => {
                this.setState({ isDeploying: false, updateMessage: 'Done!' });

                // Close the modal after a second
                setTimeout(this.onToggle, 1000);
            });
        });
    };

    onToggle = () => {
        this.setState({
            open: !this.state.open
        });
    };

    updateStatusMessage = (message) => {
        this.setState({ isDeploying: true, updateMessage: message });
    };

    render() {
        const container = this.props.container;

        const trigger = <Button onClick={ this.onToggle } size="tiny" color="yellow">Update</Button>;

        const containers = this.state.existingContainers.map(container => {
            return (
                <Table.Row key={ container.namespace }>
                    <Table.Cell>{ container.namespace }</Table.Cell>
                    <Table.Cell>{ container.image }</Table.Cell>
                </Table.Row>
            )
        });

        const namespaces = this.state.namespaces.map(namespace => {
            return {
                text: namespace.name,
                value: namespace.name
            }
        });

        const formName = "container-update-" + container.name;

        let positiveButtonIcon = 'checkmark';
        if (this.state.isDeploying) {
            positiveButtonIcon = 'refresh';
        }

        return (
            <Modal trigger={ trigger } open={ this.state.open } onOpen={ this.onOpen }>
                <Modal.Header>Update container</Modal.Header>

                <Modal.Content>
                    <p>You are updating the container <strong>{ container.name }</strong>.</p>

                    <Header>Existing Containers</Header>

                    <div>
                    <Loadable loading={ this.state.isLoading }>
                        <Table columns={ 2 } fixed>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Namespace</Table.HeaderCell>
                                    <Table.HeaderCell>Image</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                { containers }
                            </Table.Body>
                        </Table>
                    </Loadable>
                    </div>

                    <Header>Options</Header>

                    <p>Choose the new image and namespace to apply the update in:</p>

                    <Form id={ formName } onSubmit={ this.onSubmit }>
                        <Form.Group widths="equal">
                            <Form.Input name="image" defaultValue={ container.image } />
                            <Form.Select name="namespace" placeholder="Choose a namespace" options={ namespaces } error={ this.state.errorNamespace } />
                        </Form.Group>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button negative icon="remove" labelPosition="right" content="Cancel" onClick={ this.onToggle }/>
                    <Button positive icon labelPosition="right" form={ formName} type="submit">
                        <Icon loading={ this.state.isDeploying } name={ positiveButtonIcon } /> { this.state.updateMessage }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}