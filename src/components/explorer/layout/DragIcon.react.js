import '../../../css/drag-handle.css';

import React from 'react';
import assign from 'object-assign';

import { CGPS } from '^/app/constants';

const background = '#fff';

const buttonRadius = 20;
const buttonPosition = `calc(50% - ${buttonRadius}px)`;
const hButtonOffset = `-${buttonRadius}px`;
const vButtonOffset = `-${buttonRadius - 2}px`;

const buttonStyle = {
  position: 'absolute',
  background,
};
const buttonClasses = 'mdl-button mdl-button--fab mdl-button--mini-fab';

const arrowStyle = { color: CGPS.COLOURS.PURPLE };
const upArrowStyle = assign({ top: '37.5%' }, arrowStyle);
const downArrowStyle = assign({ top: '62.5%' }, arrowStyle);
const leftArrowStyle = assign({ left: '37.5%', transform: 'translate(-12px, -12px) rotate(-90deg)' }, arrowStyle);
const rightArrowStyle = assign({ left: '62.5%', transform: 'translate(-12px, -12px) rotate(-90deg)' }, arrowStyle);


export default React.createClass({

  displayName: 'DragIcon',

  propTypes: {
    direction: React.PropTypes.string,
  },

  render() {
    const direction = this.props.direction;

    const horizontalStyle = assign({
      top: hButtonOffset,
      left: buttonPosition,
    }, buttonStyle);

    const verticalStyle = assign({
      top: buttonPosition,
      left: vButtonOffset,
    }, buttonStyle);

    const className = `${buttonClasses} wgsa-drag-handle wgsa-drag-handle--${direction}`;
    if (direction === 'horizontal') {
      return (
        <a
          className={className}
          style={horizontalStyle}>
          <i className="material-icons" style={upArrowStyle}>arrow_drop_up</i>
          <i className="material-icons" style={downArrowStyle}>arrow_drop_down</i>
        </a>
      );
    } else if (direction === 'vertical') {
      return (
        <a
          className={className}
          style={verticalStyle}>
          <i className="material-icons" style={leftArrowStyle}>arrow_drop_up</i>
          <i className="material-icons" style={rightArrowStyle}>arrow_drop_down</i>
        </a>
      );
    }
  },

});
