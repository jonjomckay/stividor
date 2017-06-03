import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';

class WizardStep extends Component {
    render() {
        return (
            <Grid columns={ 2 }>
                { this.props.children }
            </Grid>
        );
    }
}

WizardStep.Content = class extends Component {
    render() {
        return (
            <Grid.Column width={ 7 }>
                { this.props.children }
            </Grid.Column>
        )
    }
};

WizardStep.Sidebar = class extends Component {
    render() {
        return (
            <Grid.Column width={ 8 } floated="right">
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{ this.props.title }</Card.Header>
                        <Card.Description>
                            { this.props.children }
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Grid.Column>
        )
    }
};

WizardStep.Sidebar.propTypes = {
    title: React.PropTypes.string.isRequired
};

export default WizardStep;