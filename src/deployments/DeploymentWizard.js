import React, { Component } from 'react';

import Multistep from '../common/Multistep';
import Step1 from './wizard/Step1';
import Step2 from './wizard/Step2';
import Step3 from './wizard/Step3';
import Step4 from './wizard/Step4';

export default class DeploymentWizard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            application: '',
            containers: [],
            namespace: ''
        };
    }

    onChangeContainers = (containers) => {
        this.setState({
            containers: containers
        });
    };

    onChooseApplication = (e, { name }) => {
        this.setState({
            application: name
        });
    };

    onChooseNamespace = (e, { value }) => {
        this.setState({
            namespace: value
        });
    };

    onFinish = () => {
        console.log(this.state);
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
                component: <Step2 onChooseApplication={ this.onChooseApplication } selectedApplication={ this.state.application } />
            },
            {
                name: 'Step 3',
                description: 'Choose container versions',
                title: 'Choose Container Versions',
                component: <Step3 application={ this.state.application } namespace={ this.state.namespace } onChangeContainers={ this.onChangeContainers } />
            },
            {
                name: 'Step 4',
                description: 'Deploy',
                title: 'Deploy',
                component: <Step4 application={ this.state.application } containers={ this.state.containers } namespace={ this.state.namespace } />
            }
        ];

        return (
            <div>
                <Multistep onFinish={ this.onFinish } steps={ steps } />
            </div>
        );
    }
}