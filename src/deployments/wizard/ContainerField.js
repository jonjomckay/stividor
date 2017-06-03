import React, { Component } from 'react';
import { Form, Icon, Input } from 'semantic-ui-react';

class ContainerField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: ''
        }
    }

    onClickCopyImage = () => {
        this.setState({
            image: this.props.image
        });

        this.props.onChangeImage(this.props.name, this.props.image);
    };

    onChangeImage = (e, { value }) => {
        this.setState({
            image: value
        });

        this.props.onChangeImage(this.props.name, value);
    };

    render() {
        return (
            <div>
                <h3>{ this.props.name }</h3>

                <Form>
                    <Form.Group widths="equal">
                        <Form.Field>
                            <label>Current Image</label>
                            <Input defaultValue={ this.props.image } disabled/>
                        </Form.Field>

                        <Icon link name="arrow circle outline right" onClick={ this.onClickCopyImage } />

                        <Form.Field>
                            <label>New Image</label>
                            <Input onChange={ this.onChangeImage } value={ this.state.image } />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}

ContainerField.propTypes = {
    image: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    onChangeImage: React.PropTypes.func.isRequired
};

export default ContainerField;