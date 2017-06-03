import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

import WizardStep from '../../common/WizardStep';

class Step4 extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const containers = this.props.containers.map(container => {
            return (
                <div key={ container.name }>
                    <strong>{ container.name }</strong>: { container.image }
                </div>
            );
        });

        return (
          <WizardStep>
              <WizardStep.Content>
                  <Segment basic>
                      <Header as="h3">Namespace</Header>

                      <div>{ this.props.namespace }</div>
                  </Segment>

                  <Segment basic>
                      <Header as="h3">Application</Header>

                      <div>{ this.props.application }</div>
                  </Segment>

                  <Segment basic>
                      <Header as="h3">Containers</Header>

                      { containers }
                  </Segment>
              </WizardStep.Content>

              <WizardStep.Sidebar title="Deploy">
                  <p>Now it's time to deploy the application.</p>

                  <p>Your chosen namespace and application are displayed to the left - make sure they're the right ones,
                      as finishing will deploy the new versions straight to Kubernetes and commit the new deployments to GitHub.</p>
              </WizardStep.Sidebar>
          </WizardStep>
        );
    }
}

export default Step4;