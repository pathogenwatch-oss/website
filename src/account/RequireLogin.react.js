import React from 'react';

import config from '../app/config';

export default createClass({

  componentWillMount() {
    if (!config.user) {
      this.props.history.replace('/');
    }
  },

  render() {
    return this.props.children;
  },

});
