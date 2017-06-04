import React, { Component } from 'react';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kubernetesHost: '',
            kubernetesToken: ''
        };
    }

    componentDidMount = () => {
        this.setState({
            kubernetesHost: localStorage.getItem('kubernetes.host'),
            kubernetesToken: localStorage.getItem('kubernetes.token')
        });
    };

    onChangeKubernetesHost = (e) => {
        this.setState({
            kubernetesHost: e.target.value
        });
    };

    onChangeKubernetesToken = (e) => {
        this.setState({
            kubernetesToken: e.target.value
        });
    };


    onSave = (e) => {
        e.preventDefault();

        localStorage.setItem('kubernetes.host', this.state.kubernetesHost);
        localStorage.setItem('kubernetes.token', this.state.kubernetesToken);

        this.props.onSave();
    };

    render() {
        return (
            <div>
                <h1 className="title">Settings</h1>

                <form className="form">
                    <div>
                        <h4>Kubernetes</h4>

                        <div className="form-item">
                            <label>API Host</label>
                            <input type="text" className="w50" onChange={ this.onChangeKubernetesHost } value={ this.state.kubernetesHost } />
                        </div>

                        <div className="form-item">
                            <label>API Token</label>
                            <input type="text" className="w50" onChange={ this.onChangeKubernetesToken } value={ this.state.kubernetesToken } />
                        </div>
                    </div>

                    <div className="form-item">
                        <button onClick={ this.onSave }>Save</button>
                    </div>
                </form>
            </div>
        );
    }
}