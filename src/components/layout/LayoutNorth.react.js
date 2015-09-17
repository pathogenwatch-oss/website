import React from 'react';
import LayoutUtils from '../../utils/Layout';

export default React.createClass({

  propTypes: {
    height: React.PropTypes.number.isRequired,
  },

  render: function () {
    const width = LayoutUtils.getViewportWidth();
    const height = this.props.height;

    const style = {
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      top: '56px',
      left: 0,
      zIndex: 1,
      overflow: 'hidden',
    };

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  },

});
