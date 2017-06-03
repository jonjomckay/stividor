import React, { Component } from 'react';
import { Header, Icon, Input, Menu } from 'semantic-ui-react';

import ApplicationService from '../ApplicationService';
import Loadable from '../../common/Loadable';
import WizardStep from '../../common/WizardStep';

class Step2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applications: [],
            loading: true,
            searchableApplications: [],
            selectedApplication: ''
        };
    }

    componentDidMount = () => {
        ApplicationService.fetchAll().then(applications => {
            this.setState({
                applications: applications,
                loading: false,
                searchableApplications: applications
            });
        });
    };

    onSearchApplication = (e, { value }) => {
        this.setState({
            searchableApplications: this.state.applications.filter(application => application.includes(value))
        });
    };

    render() {
        const templateRepoName = process.env.REACT_APP_GITHUB_TEMPLATE_REPO_NAME;

        const applications = this.state.searchableApplications.map(application => {
            const selectedApplication = this.props.selectedApplication;

            return (
              <Menu.Item active={ selectedApplication === application }
                         onClick={ this.props.onChooseApplication }
                         key={ application }
                         name={ application }>
                  <Header as="div">
                      <Header.Content>
                          { application }

                          <Header.Subheader>
                              <Icon name="github" size="small" />

                              { templateRepoName }/{ application }
                          </Header.Subheader>
                      </Header.Content>
                  </Header>
              </Menu.Item>
            );
        });

        return (
          <WizardStep>
              <WizardStep.Content>
                  <Input fluid onChange={ this.onSearchApplication } placeholder="Search for an application" />

                  <Loadable loading={ this.state.loading }>
                      <Menu fluid secondary vertical>
                          { applications }
                      </Menu>
                  </Loadable>
              </WizardStep.Content>

              <WizardStep.Sidebar title="Applications">
                  <p>Some description about applications go here</p>
              </WizardStep.Sidebar>
          </WizardStep>
        );
    }
}

export default Step2;