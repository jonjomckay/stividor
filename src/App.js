import React, { Component } from 'react';
import Router, { Link } from 'react-router-component';
import { Container, Menu } from 'semantic-ui-react';
import ApplicationList from "./applications/ApplicationList";
import ApplicationShow from "./applications/ApplicationShow";

class App extends Component {
    render() {
        return (
            <div>
                <Menu borderless>
                    <Container>
                    <Menu.Item header>Stividor</Menu.Item>
                    <Menu.Item>
                        <Link href="/" className="nav-link">Applications</Link>
                    </Menu.Item>
                    </Container>
                </Menu>

                <Container>
                    <Router.Locations>
                        <Router.Location path="/" handler={ ApplicationList } />
                        <Router.Location path="/:application" handler={ ApplicationShow } />
                    </Router.Locations>
                </Container>
            </div>
        );
    }
}

export default App;
