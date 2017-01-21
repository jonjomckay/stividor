import React, { Component } from 'react';
import { Button, Form, Header, Modal, Table } from 'semantic-ui-react';
import Kubernetes from '../Kubernetes';
import Loadable from '../Loadable';

export default class ContainerUpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorNamespace: false,
            existingContainers: [],
            loadingContainers: true,
            namespaces: [],
            open: false
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
                loadingContainers: false
            })
        });
    };

    onSubmit = (e, { formData }) => {
        e.preventDefault();

        this.setState({ errorNamespace: false });

        if (formData.namespace === '') {
            this.setState({ errorNamespace: true });
            return;
        }

        // Try and load the deployment from the namespace if it exists (TODO: I think there's a more precise API endpoint for this)
        Kubernetes.fetchDeploymentsByNamespace(formData.namespace, (err, response) => {
            var deployment = (response.items || []).find(i => i.metadata.name === this.props.container.deployment);
            if (deployment) {
                // If it does then patch the deployment in the namespace with the new container

                const patch = {
                    spec: {
                        template: {
                            spec: {
                                containers: [
                                    {
                                        name: this.props.container.name,
                                        image: formData.image
                                    }
                                ]
                            }
                        }
                    }
                };

                Kubernetes.patchDeployment(formData.namespace, this.props.container.deployment, patch, (err, response) => {
                    console.log(err);
                    console.log(response);
                })
            } else {
                // If it doesn't then create it from the template in Github
            }
        });

        // Somehow commit the new deployment to Github
    };

    onToggle = () => {
        this.setState({
            open: !this.state.open
        });
    };

    render() {
        const container = this.props.container;

        const trigger = <a onClick={ this.onToggle }>{ container.name }</a>;

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

        return (
            <Modal trigger={ trigger } open={ this.state.open } onOpen={ this.onOpen }>
                <Modal.Header>Update container</Modal.Header>

                <Modal.Content>
                    <p>You are updating the container <strong>{ container.name }</strong>.</p>

                    <Header>Existing Containers</Header>

                    <div>
                    <Loadable loading={ this.state.loadingContainers }>
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
                    <Button positive icon="checkmark" labelPosition="right" content="Update" form={ formName}  type="submit" />
                </Modal.Actions>
            </Modal>
        );
    }
}