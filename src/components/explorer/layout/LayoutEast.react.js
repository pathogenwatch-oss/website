import React from 'react';

export default React.createClass({

  propTypes: {
    left: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    children: React.PropTypes.element,
  },

  render() {
    const { left, width } = this.props;

    const style = {
      position: 'absolute',
      top: 0,
      left: `${left}px`,
      width: `${width}px`,
      height: '100%',
      overflow: 'hidden',
    };

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  },

});
