import React, { Component } from 'react';

import NamespaceChooser from '../../namespaces/NamespaceChooser';
import WizardStep from '../../common/WizardStep';

class Step1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namespaces: []
        };
    }

    render() {
        return (
          <WizardStep>
              <WizardStep.Content>
                  <p>Choose the namespace that you want to deploy an application to</p>

                  <NamespaceChooser onChange={ this.props.onChooseNamespace } selectedValue={ this.props.selectedNamespace } />
              </WizardStep.Content>

              <WizardStep.Sidebar title="Namespaces">
                  <p>A namespace needs to be chosen to deploy your application to.</p>

                  <p>It's a completely separated "virtual cluster" that allows applications to be run in separate
                      environments.</p>

                  <p>Read the <a href="https://kubernetes.io/docs/user-guide/namespaces/" target="_blank">official
                      documentation</a> for more information</p>
              </WizardStep.Sidebar>
          </WizardStep>
        );
    }
}

Step1.propTypes = {
    onChooseNamespace: React.PropTypes.func.isRequired,
    selectedNamespace: React.PropTypes.string
};

export default Step1;