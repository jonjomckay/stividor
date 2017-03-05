import React, { Component } from 'react';
import { Button, Form, Header, Icon, Input, Modal, Popup, Table } from 'semantic-ui-react';
import deepMerge from 'deepmerge';
import Kubernetes from '../clients/Kubernetes';
import Loadable from '../common/Loadable';
import DeploymentService from "../deployments/DeploymentService";
import TemplateService from "../deployments/TemplateService";

export default class ApplicationDeployModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deploymentTemplate: {

            },
            errorNamespace: false,
            existingContainers: [],
            isDeploying: false,
            isLoading: true,
            namespaces: [],
            open: false,
            selectedNamespace: null,
            templateContainers: [],
            updateMessage: 'Deploy'
        };
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            selectedNamespace: nextProps.namespace
        });
    };

    onMount = () => {
        this.setState({ existingContainers: [] });

        Kubernetes.fetchDeploymentByNamespace(this.props.namespace, this.props.application, (err, response) => {
            if (response) {
                const existingContainers = response.spec.template.spec.containers.map(container => {
                    return container;
                });

                this.setState( { deploymentTemplate: response, existingContainers: existingContainers });
            }

            // Now load the deployment template from GitHub
            TemplateService.fetchDeploymentTemplate(this.props.application).then(template => {
                const containers = template.spec.template.spec.containers.map(container => {
                    return container;
                });

                this.setState({ templateContainers: containers });
            }).then(() => {
                this.setState({ isLoading: false });
            });
        });
    };

    onSubmit = (e, { formData }) => {
        e.preventDefault();

        this.updateStatusMessage('Deploying...');

        // TODO: Check if the deployment exists already in the namespace in Kubernetes
        // TODO: If it doesn't then create it from the template in GitHub

        // Create the patch for the containers we want to update
        const containers = Object.keys(formData).map(container => {
            return {
                name: container,
                image: formData[container]
            }
        });

        const patch = {
            metadata: {
                namespace: this.state.selectedNamespace
            },
            spec: {
                template: {
                    spec: {
                        containers: containers
                    }
                }
            }
        };

        console.log(this.state);

        // Update the deployment from the template in GitHub
        this.updateDeploymentFromTemplate(this.state.deploymentTemplate, patch);

        // TODO: Somehow commit the new deployment to GitHub

    };

    updateDeploymentFromTemplate = (template, patch) => {
        const deploymentName = template.metadata.name;
        const namespace = this.state.selectedNamespace;

        // Patch the deployment template with the desired changes
        const deploymentContent = deepMerge(template, patch);

        this.updateStatusMessage('Patching deployment in Kubernetes');

        // Patch the deployment in the namespace with the new containers
        Kubernetes.patchDeployment(namespace, deploymentName, patch, () => {
            this.updateStatusMessage('Updating deployment in Github');

            // Save the deployment into the GitHub deployments repository
            DeploymentService.updateGithubDeployment(deploymentName, namespace, deploymentContent).then(() => {
                this.setState({ isDeploying: false, updateMessage: 'Done!' });

                // Close the modal after a second
                setTimeout(this.onToggle, 1000);
            });
        });
    };

    onToggle = () => {
        this.setState({
            open: !this.state.open,
            updateMessage: 'Deploy'
        });
    };

    updateStatusMessage = (message) => {
        this.setState({ isDeploying: true, updateMessage: message });
    };

    render() {
        var positiveButtonDisabled = true;
        if (this.state.selectedNamespace) {
            positiveButtonDisabled = false;
        }

        const button = <Button floated="left" fluid content="Deploy" color="green" icon="upload" labelPosition="left" disabled={ positiveButtonDisabled } onClick={ this.onToggle } />;

        const trigger = (
            <Popup trigger={ button }>
                <Popup.Header>Deploy</Popup.Header>
                <Popup.Content>
                    Deploy the application to the selected namespace, with any given changes to the container images
                </Popup.Content>
            </Popup>
        );

        let existingContainers;
        if (this.state.existingContainers.length) {
            existingContainers = this.state.existingContainers.map(container => {
                return (
                  <Table.Row key={ container.image }>
                      <Table.Cell>{ container.name }</Table.Cell>
                      <Table.Cell>{ container.image }</Table.Cell>
                  </Table.Row>
                )
            });
        } else {
            existingContainers = (
                <Table.Row>
                    <Table.Cell>No containers</Table.Cell>
                </Table.Row>
            );
        }

        const templateContainers = this.state.templateContainers.map(container => {
            return (
                <Table.Row key={ container.image }>
                    <Table.Cell>{ container.name }</Table.Cell>
                    <Table.Cell>
                        <Form.Field inline key={ container.name }>
                            <Input defaultValue={ container.image } name={ container.name } fluid />
                        </Form.Field>
                    </Table.Cell>
                </Table.Row>
            );
        });

        const formName = "container-update-" + this.props.application;

        let positiveButtonIcon = 'checkmark';
        if (this.state.isDeploying) {
            positiveButtonIcon = 'refresh';
        }

        return (
            <Modal trigger={ trigger } open={ this.state.open } onMount={ this.onMount }>
                <Modal.Header>Update application</Modal.Header>

                <Modal.Content>
                    <Loadable loading={ this.state.isLoading }>
                        <p>You are updating the application <strong>{ this.props.application }</strong> in the <strong>{ this.props.namespace }</strong> namespace.</p>

                        <Header>Existing Containers</Header>

                        <div>
                            <Table columns={ 2 } fixed>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Namespace</Table.HeaderCell>
                                        <Table.HeaderCell>Image</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    { existingContainers }
                                </Table.Body>
                            </Table>
                        </div>

                        <Header>Containers to Deploy</Header>

                        <p>Choose the new container images to deploy:</p>

                        <Form id={ formName } onSubmit={ this.onSubmit } width="equal">
                            <Table columns={ 2 } fixed>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Namespace</Table.HeaderCell>
                                        <Table.HeaderCell>Image</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    { templateContainers }
                                </Table.Body>
                            </Table>
                        </Form>
                    </Loadable>
                </Modal.Content>

                <Modal.Actions>
                    <Button negative icon="remove" labelPosition="right" content="Cancel" onClick={ this.onToggle }/>
                    <Button positive icon labelPosition="right" form={ formName } type="submit">
                        <Icon loading={ this.state.isDeploying } name={ positiveButtonIcon } /> { this.state.updateMessage }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}