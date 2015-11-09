import React from 'react';
import assign from 'object-assign';

const style = {
  position: 'absolute',
  width: '100%',
  bottom: 0,
  backgroundColor: '#ffffff',
  zIndex: 1,
};

export default React.createClass({

  propTypes: {
    top: React.PropTypes.number.isRequired,
    children: React.PropTypes.element,
  },

  render() {
    const { top, children } = this.props;

    return (
      <div style={assign({ top }, style)}>
        {children}
      </div>
    );
  },

});
