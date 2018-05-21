import React from 'react';

import { subscribe, unsubscribe } from '../utils/Notification';

import config from '../app/config';

export default React.createClass({

  componentWillMount() {
    const { room = config.clientId, topic, onMessage } = this.props;
    subscribe(room, topic, onMessage);
  },

  componentWillUnmount() {
    const { room = config.clientId } = this.props;
    unsubscribe(room);
  },

  render() {
    return this.props.children;
  },

});
