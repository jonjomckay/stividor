import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Popup, Table } from 'semantic-ui-react';
import Kubernetes from '../clients/Kubernetes';
import Loadable from '../common/Loadable';

export default class ApplicationRedeployModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deploymentTemplate: {
                metadata: {
                    name: '',
                    namespace: ''
                }
            },
            existingContainers: [],
            isDeploying: false,
            isLoading: true,
            open: false,
            selectedNamespace: null,
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

            this.setState({ isLoading: false });
        });
    };

    onSubmit = () => {
        this.updateStatusMessage('Redeploying...');

        // Create the patch to force a redeployment (kinda hacky)
        const patch = {
            metadata: {
                namespace: this.state.selectedNamespace
            },
            spec: {
                template: {
                    metadata: {
                        labels: {
                            date: Date.now().toString()
                        }
                    }
                }
            }
        };

        // Update the deployment from the template in GitHub
        this.updateDeploymentFromTemplate(this.state.deploymentTemplate, patch);
    };

    updateDeploymentFromTemplate = (template, patch) => {
        this.updateStatusMessage('Patching deployment in Kubernetes');

        // Patch the deployment in the namespace with the new containers
        Kubernetes.patchDeployment(template.metadata.namespace, template.metadata.name, patch, () => {
            this.setState({ isDeploying: false, updateMessage: 'Done!' });

            // Close the modal after a second
            setTimeout(this.onToggle, 1000);
        });
    };

    onToggle = () => {
        this.setState({
            open: !this.state.open,
            updateMessage: 'Redeploy'
        });
    };

    updateStatusMessage = (message) => {
        this.setState({ isDeploying: true, updateMessage: message });
    };

    render() {
        let positiveButtonDisabled = true;
        if (this.state.selectedNamespace) {
            positiveButtonDisabled = false;
        }

        const button = <Button content="Redeploy" color="yellow" icon="refresh" labelPosition="left" disabled={ positiveButtonDisabled } onClick={ this.onToggle } />;

        const trigger = (
            <Popup trigger={ button }>
                <Popup.Header>Redeploy</Popup.Header>
                <Popup.Content>
                    Handy for updating an application with a container where the the same image name is reused (e.g. a
                    branch-based naming strategy)
                </Popup.Content>
            </Popup>
        );

        // TODO: Remove the check for existing containers when we pre-check before loading this component
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

        let positiveButtonIcon = 'checkmark';
        if (this.state.isDeploying) {
            positiveButtonIcon = 'refresh';
        }

        return (
            <Modal trigger={ trigger } open={ this.state.open } onMount={ this.onMount }>
                <Modal.Header>Redeploy application</Modal.Header>

                <Modal.Content>
                    <Loadable loading={ this.state.isLoading }>
                        <p>You are redeploying the application <strong>{ this.props.application }</strong> in the <strong>{ this.props.namespace }</strong> namespace.</p>

                        <Header>Containers</Header>

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
                    </Loadable>
                </Modal.Content>

                <Modal.Actions>
                    <Button negative icon="remove" labelPosition="right" content="Cancel" onClick={ this.onToggle }/>
                    <Button color="yellow" icon labelPosition="right" onClick={ this.onSubmit }>
                        <Icon loading={ this.state.isDeploying } name={ positiveButtonIcon } /> { this.state.updateMessage }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}