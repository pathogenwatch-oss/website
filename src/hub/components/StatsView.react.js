import React from 'react';

export default React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  render() {
    const { items } = this.props;
    return (
      <div>Stats</div>
    );
  },

});
