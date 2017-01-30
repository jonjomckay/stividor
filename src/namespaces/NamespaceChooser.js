import React, { Component } from "react";
import { Select } from "semantic-ui-react";
import Kubernetes from "../clients/Kubernetes";

class NamespaceChooser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namespaces: []
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.namespaces) {
            this.setState({
                namespaces: nextProps.namespaces
            });
        }
    };

    componentDidMount = () => {
        // If a list of namespaces was passed in via props then use that, otherwise fetch the list from Kubernetes
        if (this.props.namespaces) {
            this.setState({
                namespaces: this.props.namespaces
            });
        } else {
            Kubernetes.fetchNamespaces((err, response) => {
                this.setState({
                    namespaces: response.items.map(item => item.metadata.name)
                })
            });
        }
    };

    render() {
        const options = this.state.namespaces.map(namespace => {
            return {
                value: namespace,
                text: namespace
            }
        });

        let value;
        if (options.length) {
            value = options[0].value;
        }

        return (
            <Select fluid
                    defaultValue={ value }
                    onChange={ this.props.onChange }
                    options={ options }
                    placeholder="Choose a namespace" />
        );
    }
}

NamespaceChooser.propTypes = {
    namespaces: React.PropTypes.arrayOf(React.PropTypes.string),
    onChange: React.PropTypes.func.isRequired
};

export default NamespaceChooser;