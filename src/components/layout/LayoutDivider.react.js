import React from 'react';
import LayoutUtils from '../../utils/Layout';
import DragIcon from './DragIcon.react';

const LayoutDivider = React.createClass({

  propTypes: {
    direction: React.PropTypes.string.isRequired,
    isStatic: React.PropTypes.bool,
    top: React.PropTypes.number,
    left: React.PropTypes.number,
    className: React.PropTypes.string,
  },

  getWidth: function () {
    var direction = this.props.direction;

    if (direction === 'vertical') {
      return LayoutUtils.getDividerSize() + 'px';
    } else if (direction === 'horizontal') {
      return '100%';
    }

    return 'normal';
  },

  getHeight: function () {
    var direction = this.props.direction;

    if (direction === 'vertical') {
      return '100%';
    } else if (direction === 'horizontal') {
      return LayoutUtils.getDividerSize() + 'px';
    }

    return 'normal';
  },

  render: function () {
    const style = {
      backgroundColor: '#fff',
      position: 'absolute',
      top: this.props.top || 0,
      left: this.props.left || 0,
      width: this.getWidth(),
      height: this.getHeight(),
      zIndex: 2,
      boxShadow: this.props.direction === 'horizontal' ?
        '0 -1px 1.5px 0 rgba(0,0,0,.12), 0 -4px 4px 0 rgba(0,0,0,.06)' :
        '1px 0 1.5px 0 rgba(0,0,0,.12), 4px 0px 4px 0 rgba(0,0,0,.06)',
    };
    const isStatic = this.props.isStatic || false;

    return (
      <div className={this.props.className || ''} style={style}>
        {isStatic ? null : <DragIcon direction={this.props.direction} />}
        {this.props.children}
      </div>
    );
  },

});

module.exports = LayoutDivider;
