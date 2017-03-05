import React, { Component } from "react";
import { Select } from "semantic-ui-react";
import Kubernetes from '../clients/Kubernetes';
import Loadable from '../common/Loadable';

class NamespaceChooser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
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
        if (this.props.namespaces && this.props.namespaces.length) {
            this.setState({
                loading: false,
                namespaces: this.props.namespaces
            });
        } else {
            Kubernetes.fetchNamespaces((err, response) => {
                this.setState({
                    loading: false,
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
        if (this.props.selectedValue) {
            value = this.props.selectedValue;
        } else if (options.length) {
            value = options[0].value;
        }

        return (
            <Loadable loading={ this.state.loading }>
                <Select fluid
                        defaultValue={ value }
                        onChange={ this.props.onChange }
                        options={ options }
                        placeholder="Choose a namespace" />
            </Loadable>
        );
    }
}

NamespaceChooser.propTypes = {
    namespaces: React.PropTypes.arrayOf(React.PropTypes.string),
    onChange: React.PropTypes.func.isRequired,
    selectedValue: React.PropTypes.string
};

export default NamespaceChooser;