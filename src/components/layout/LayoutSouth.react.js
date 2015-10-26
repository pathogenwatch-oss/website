import React from 'react';

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
    style.top = this.props.top;

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  },

});
