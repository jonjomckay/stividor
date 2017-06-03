import React, { Component } from 'react';
import Router, { Link } from 'react-router-component';
import { Container, Menu } from 'semantic-ui-react';
import ApplicationList from "./applications/ApplicationList";
import ApplicationShow from "./applications/ApplicationShow";
import DeploymentWizard from './deployments/DeploymentWizard';
import Notifications from './Notifications';
import './App.css';

class App extends Component {
    static childContextTypes = {
        addNotification: React.PropTypes.func,
    };

    getChildContext() {
        return {
            addNotification: this.addNotification.bind(this),
        };
    }

    addNotification(notification) {
        this.notifications.addNotification(notification);
    }

    render() {
        return (
            <div className="app">
                <Menu borderless>
                    <Container>
                    <Menu.Item header>Stividor</Menu.Item>
                    <Menu.Item>
                        <Link href="/" className="nav-link">h</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link href="/h" className="nav-link">Applications</Link>
                    </Menu.Item>
                    </Container>
                </Menu>

                <Container className="content">
                    <Notifications ref={ ref => this.notifications = ref } />

                    <Router.Locations>
                        <Router.Location path="/" handler={ DeploymentWizard } />
                        <Router.Location path="/h" handler={ ApplicationList } />
                        <Router.Location path="/:application" handler={ ApplicationShow } />
                    </Router.Locations>
                </Container>

                <div className="ui inverted vertical footer segment">
                    <Container textAlign="center">
                        <img src="/assets/img/logo.svg" className="ui centered mini image" />
                    </Container>
                </div>
            </div>
        );
    }
}

export default App;
