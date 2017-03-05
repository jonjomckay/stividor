import React, { Component } from 'react';
import { Card, Grid, Header, Icon } from 'semantic-ui-react';
import Multistep from '../common/Multistep';
import NamespaceChooser from '../namespaces/NamespaceChooser';

class Step1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namespaces: []
        };
    }

    render() {
        return (
            <div>
                <Grid columns={ 2 }>
                    <Grid.Column width={ 6 }>
                        <p>Choose the namespace that you want to deploy an application to</p>

                        <NamespaceChooser onChange={ this.props.onChooseNamespace } selectedValue={ this.props.selectedNamespace } />
                    </Grid.Column>
                    <Grid.Column stretched width={ 8 } floated="right">
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Namespaces</Card.Header>
                                <Card.Meta>
                                    <span className='date'>
                                      {/*Joined in 2015*/}
                                    </span>
                                </Card.Meta>
                                <Card.Description>
                                    <p>A namespace needs to be chosen to deploy your application to.</p>

                                    <p>It's a completely separated "virtual cluster" that allows applications to be run
                                        in separate environments.</p>

                                    <p>Read the <a href="https://kubernetes.io/docs/user-guide/namespaces/" target="_blank">official
                                        documentation</a> for more information</p>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

Step1.propTypes = {
    onChooseNamespace: React.PropTypes.func.isRequired,
    selectedNamespace: React.PropTypes.string
};

class Step2 extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                sup
            </div>
        );
    }
}

class Step3 extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                three
            </div>
        );
    }
}

class Step4 extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                four
            </div>
        );
    }
}

export default class DeploymentWizard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            application: '',
            namespace: ''
        };
    }

    onChooseNamespace = (e, { value }) => {
        this.setState({
            namespace: value
        });
    };

    render() {
        const steps = [
            {
                name: 'Step 1',
                description: 'Choose a namespace',
                title: 'Choose a Namespace',
                component: <Step1 onChooseNamespace={ this.onChooseNamespace } selectedNamespace={ this.state.namespace } />
            },
            {
                name: 'Step 2',
                description: 'Choose an application',
                title: 'Choose an Application',
                component: <Step2 />
            },
            {
                name: 'Step 3',
                description: 'Choose container versions',
                title: 'Choose Container Versions',
                component: <Step3 />
            },
            {
                name: 'Step 4',
                description: 'Deploy',
                title: 'Deploy',
                component: <Step4 />
            }
        ];

        return (
            <div>
                <Multistep steps={ steps } />
            </div>
        );
    }
}