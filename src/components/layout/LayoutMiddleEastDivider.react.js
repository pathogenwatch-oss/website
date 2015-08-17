import React from 'react';

import LayoutUtils from '../../utils/Layout';
import LayoutDivider from './LayoutDivider.react';

export default React.createClass({

  propTypes: {
    left: React.PropTypes.number.isRequired,
    onDragEnd: React.PropTypes.func.isRequired,
  },

  componentDidMount: function () {
    this.initialize();
  },

  initialize: function () {
    const containment = [
      // x1
      LayoutUtils.getMiddleLeft(),
      // y1
      LayoutUtils.getNorthHeight(),
      // x2
      LayoutUtils.getViewportWidth() - LayoutUtils.getDividerSize(),
      // y2
      0,
    ];

    $('.middleEastDivider').draggable({
      containment: containment,
      axis: 'x',
      scroll: false,
      stop: (event, ui) => {
        this.props.onDragEnd(ui.offset.left);
      },
    });
  },

  componentDidUpdate: function () {
    const layoutWestMiddleDividerLeft = this.props.layoutWestMiddleDividerLeft;
    const containment = [
      // x1
      layoutWestMiddleDividerLeft + LayoutUtils.getDividerSize(),
      // y1
      LayoutUtils.getNorthHeight(),
      // x2
      LayoutUtils.getViewportWidth() - LayoutUtils.getDividerSize(),
      // y2
      0,
    ];

    $('.middleEastDivider').draggable('option', 'containment', containment);
  },

  render: function () {
    const style = {
      width: '100%',
      height: '100%',
    };

    return (
      <div style={style}>
        <LayoutDivider
          left={this.props.left}
          direction={'vertical'}
          isStatic={true} />

        <LayoutDivider
          left={this.props.left}
          direction={'vertical'}
          className={'middleEastDivider'} />
      </div>
    );
  },

});
