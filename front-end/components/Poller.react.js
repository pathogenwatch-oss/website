import React from 'react';

export default React.createClass({

  componentDidMount() {
    this.interval = setInterval(this.props.fn, this.props.interval * 1000);
    this.props.fn();
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render() {
    return this.props.children || null;
  },

});
