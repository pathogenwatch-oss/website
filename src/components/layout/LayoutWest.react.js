import React from 'react';

export default React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
  },

  render: function () {
    const width = this.props.width;
    const style = {
      position: 'absolute',
      width: width + 'px',
      height: '100%',
      top: 0,
      left: 0,
      overflow: 'hidden',
    };

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  },

});
