import React, { Component, PropTypes } from 'react';
import { Button, Grid, Header, Step } from 'semantic-ui-react';

/**
 * Modified from https://github.com/srdjan/react-multistep, released under the MIT license
 */

export default class MultiStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPreviousBtn: false,
            showNextBtn: true,
            compState: 0,
            navState: this.getNavStates(0, this.props.steps.length)
        };
        this.hidden = {
            display: 'none'
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    getNavStates(indx, length) {
        let props = {};
        for (let i = 0; i < length; i++) {
            if (i < indx) {
                props['active'] = false;
                props['completed'] = true;
            }
            else if (i === indx) {
                props['active'] = true;
                props['completed'] = false;
            }
            else {
                props['active'] = false;
                props['completed'] = false;
                // styles.push('todo')
            }
        }
        return { current: indx, props: props }
    }

    checkNavState(currentStep) {
        if (currentStep > 0 && currentStep < this.props.steps.length - 1) {
            this.setState({
                showPreviousBtn: true,
                showNextBtn: true
            })
        }
        else if (currentStep === 0) {
            this.setState({
                showPreviousBtn: false,
                showNextBtn: true
            })
        }
        else {
            this.setState({
                showPreviousBtn: true,
                showNextBtn: false
            })
        }
    }

    setNavState(next) {
        this.setState({ navState: this.getNavStates(next, this.props.steps.length) })
        if (next < this.props.steps.length) {
            this.setState({ compState: next })
        }
        this.checkNavState(next);
    }

    handleKeyDown(evt) {
        if (evt.which === 13) {
            this.next()
        }
    }

    handleOnClick(evt) {
        if (evt.currentTarget.value === (this.props.steps.length - 1) &&
            this.state.compState === (this.props.steps.length - 1)) {
            this.setNavState(this.props.steps.length)
        }
        else {
            this.setNavState(evt.currentTarget.value)
        }
    }

    next() {
        this.setNavState(this.state.compState + 1)
    }

    previous() {
        if (this.state.compState > 0) {
            this.setNavState(this.state.compState - 1)
        }
    }

    renderSteps() {
        return this.props.steps.map((s, i) => {
            const active = this.state.compState === i;
            const completed = this.state.compState > i;

            return (
                <Step key={i} active={ active } completed={ completed }>
                    <Step.Content>
                        <Step.Title>{ this.props.steps[i].name }</Step.Title>
                        <Step.Description>{ this.props.steps[i].description }</Step.Description>
                    </Step.Content>
                </Step>
            );
        });
    }

    render() {
        const navigationStyle = this.props.showNavigation ? {} : this.hidden;

        return (
            <Grid container onKeyDown={this.handleKeyDown}>
                <Grid.Row>
                    <Grid.Column>
                        <Step.Group ordered style={{ display: 'flex' }}>
                            { this.renderSteps() }
                        </Step.Group>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={ 10 }>
                        <Header as="h1" content={ this.props.steps[this.state.compState].title } />
                    </Grid.Column>
                    <Grid.Column width={ 4 } floated="right" style={ navigationStyle }>
                        <Button
                                icon="left arrow"
                                content="Previous"
                                labelPosition="left"
                                disabled={ !this.state.showPreviousBtn }
                                onClick={this.previous} />
                        <Button
                                icon="right arrow"
                                color="green"
                                content="Next"
                                labelPosition="right"
                                disabled={ !this.state.showNextBtn }
                                onClick={this.next} />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        { this.props.steps[this.state.compState].component }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

MultiStep.defaultProps = {
    showNavigation: true
};