import React from 'react';

import { subscribe, unsubscribe } from '../utils/Notification';

import config from '../app/config';

export default React.createClass({

  componentWillMount() {
    this.subscribe();
  },

  componentDidUpdate() {
    if (this.isSubscribed) return;
    this.subscribe();
  },

  componentWillUnmount() {
    const { room = config.clientId } = this.props;
    if (!room || !this.isSubscribed) return;
    unsubscribe(room);
  },

  isSubscribed: false,

  subscribe() {
    const { room = config.clientId, topic, onMessage } = this.props;
    if (!room) return;
    subscribe(room, topic, onMessage);
    this.isSubscribed = true;
  },

  render() {
    return this.props.children;
  },

});
