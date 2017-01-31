import React, { Component } from 'react';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

export default class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: new OrderedSet()
        };
    }

    addNotification(message) {
        const key = Date.now();

        return this.setState((prevState) => ({
            notifications: prevState.notifications.add({
                dismissAfter: false,
                message: message,
                key: key,
                action: 'Dismiss',
                onClick: (deactivate) => {
                    this.deleteNotification(deactivate);
                }
            })
        }));
    }

    deleteNotification = (notification) => {
        this.setState((prevState) => ({
            notifications: prevState.notifications.delete(notification)
        }));
    };

    barStyleFactory = (index, style) => {
        return Object.assign(
            {},
            style,
            { top: `${2 + index * 4}rem`, bottom: null, left: null, right: '1rem', zIndex: 1000, maxWidth: '45rem' }
        );
    };

    render() {
        return (
            <NotificationStack
                notifications={ this.state.notifications.toArray() }
                onDismiss={ this.deleteNotification }
                activeBarStyleFactory={ this.barStyleFactory }
            />
        );
    }
}