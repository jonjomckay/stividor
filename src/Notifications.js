import React, { Component } from 'react';
import { NotificationStack } from 'react-notification';
import update from 'immutability-helper';

export default class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: []
        };
    }

    addNotification(message) {
        const key = Date.now();

        return this.setState({
            notifications: update(this.state.notifications, {
                $push: [{
                    message: message,
                    key: key,
                    action: 'Dismiss',
                    onClick: (deactivate) => {
                        this.removeNotification(deactivate, key);
                    }
                }]
            })
        });
    }

    deleteNotification = (notification) => {
        this.setState({
            notifications: update(this.state.notifications, {
                $unshift: [
                    notification
                ]
            })
        });
    };

    removeNotification(deactivate, count) {
        deactivate();

        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== count)
        })
    }

    render() {
        return (
            <NotificationStack
                notifications={ this.state.notifications }
                onDismiss={ this.deleteNotification }
            />
        );
    }
}