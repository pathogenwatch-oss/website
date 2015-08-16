import React from 'react';
import assign from 'object-assign';

import LayoutUtils from '../../utils/Layout';
import { CGPS } from '../../defaults';

const background = '#fff';

const buttonRadius = 20;

const hButtonOffset = `-${buttonRadius}px`;
const vButtonOffset = `-${buttonRadius - 2}px`;

const buttonStyle = {
  position: 'absolute',
  background,
};

const arrowStyle = { color: CGPS.COLOURS.PURPLE };
const upArrowStyle = assign({ top: '37.5%' }, arrowStyle);
const downArrowStyle = assign({ top: '62.5%' }, arrowStyle);
const leftArrowStyle = assign({ left: '37.5%', transform: 'translate(-12px, -12px) rotate(-90deg)' }, arrowStyle);
const rightArrowStyle = assign({ left: '62.5%', transform: 'translate(-12px, -12px) rotate(-90deg)' }, arrowStyle);

const DragIcon = React.createClass({
  render: function () {
    const direction = this.props.direction;
    const horizontalLeft = (LayoutUtils.getViewportWidth() / 2) - buttonRadius;
    const verticalTop = (LayoutUtils.getNorthHeight() / 2) - buttonRadius;

    const horizontalStyle = assign({
      top: hButtonOffset,
      left: horizontalLeft,
    }, buttonStyle);


    const verticalStyle = assign({
      top: verticalTop,
      left: vButtonOffset,
    }, buttonStyle);

    if (direction === 'horizontal') {
      return (
        <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" style={horizontalStyle}>
          <i className="material-icons" style={upArrowStyle}>arrow_drop_up</i>
          <i className="material-icons" style={downArrowStyle}>arrow_drop_down</i>
        </button>
      );
    } else if (direction === 'vertical') {
      return (
        <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" style={verticalStyle}>
          <i className="material-icons" style={leftArrowStyle}>arrow_drop_up</i>
          <i className="material-icons" style={rightArrowStyle}>arrow_drop_down</i>
        </button>
      );
    }
  },

});

module.exports = DragIcon;
