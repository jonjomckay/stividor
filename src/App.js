import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Link,
    Route,
    NavLink
} from 'react-router-dom';
import QuickUpdate from './QuickUpdate';
import Deployments from './deployments/Deployments';

import 'font-awesome/css/font-awesome.css';
import 'kube/dist/css/kube.css';
import './App.css';
import NamespaceDropdown from "./namespaces/NamespaceDropdown";
import Settings from "./settings/Settings";
import ContentWrapper from "./ContentWrapper";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namespace: ''
        };
    }

    onChangeNamespace = (e) => {
        this.setState({
            namespace: e.target.value
        });
    };

    onSaveSettings = () => {

    };

    render() {
        let namespaceError;

        if (!this.state.namespace) {
            namespaceError = (
                <li>
                    <div className="popaside">
                        <i className="fa fa-fw fa-exclamation" /> Choose a namespace
                    </div>
                </li>
            );
        }

        return (
            <Router>
                <div className="content">
                    <header className="top">
                        <div className="brand">
                            <a href="/">Stividor</a>
                        </div>
                        <nav className="main">
                            <ul>
                                <li>
                                    <NavLink exact to="/">Home</NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/namespaces">Namespaces</NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/deployments">Deployments</NavLink>
                                </li>
                            </ul>
                        </nav>
                        <nav className="extra">
                            <ul>
                                { namespaceError }
                                <li style={{ width: '300px' }}>
                                    <NamespaceDropdown namespace={ this.state.namespace } onChange={ this.onChangeNamespace } />
                                </li>
                                <li>
                                    <Link className="button" to="/">Quick Update</Link>
                                </li>
                                <li>
                                    <Link to="/settings">
                                        <i className="fa fa-fw fa-lg fa-cog" />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </header>

                    <div id="main">
                            <Route exact path="/" render={ (props) => (
                                <ContentWrapper {...props} component={ QuickUpdate } namespace={ this.state.namespace } />
                            ) } />
                            <Route exact path="/deployments" render={ (props) => (
                                <ContentWrapper {...props} component={ Deployments } namespace={ this.state.namespace } />
                            ) } />
                            <Route exact path="/settings" render={ (props) => (
                                <ContentWrapper {...props} component={ Settings } onSave={ this.onSaveSettings } />
                            ) } />
                    </div>

                    <footer className="bottom">
                        <div className="wrapper">
                            <p>Powered by <strong>Kubernetes</strong> &amp; <strong>React</strong></p>
                            <nav>
                                <ul>
                                    <li className="strong">Stividor</li>
                                    <li>
                                        <a target="_blank" href="https://github.com/jonjomckay/stividor" rel="noopener noreferrer">GitHub</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </footer>
                </div>
            </Router>
        );
    }
}

export default App;
