import React from 'react';

import Data from './Data.react';

import LayoutContainer from './layout/LayoutContainer.react';
import LayoutWest from './layout/LayoutWest.react';

import LayoutEast from './layout/LayoutEast.react';
import LayoutNorth from './layout/LayoutNorth.react';
import LayoutSouth from './layout/LayoutSouth.react';

import WestContent from './WestContent.react';
import EastContent from './EastContent.react';

import LayoutWestEastDivider from './layout/LayoutWestEastDivider.react';
import LayoutNorthSouthDivider from './layout/LayoutNorthSouthDivider.react';

import LayoutUtils from '../utils/Layout';

const Layout = React.createClass({

  getInitialState: function () {
    return {
      layoutWestWidth: 0,

      layoutWestEastDividerLeft: 0,

      layoutEastLeft: 0,
      layoutEastWidth: 0,

      layoutNorthHeight: 0,

      layoutNorthSouthDividerTop: 0,

      layoutSouthTop: 0,
      layoutSouthHeight: 0,
      layoutSouthWidth: 0,
    };
  },

  componentWillMount: function () {
    this.setLayout();
  },

  componentDidMount: function () {
    this.dangerouslyHandleWindowResize();
  },

  dangerouslyHandleWindowResize: function () {
    $(window).on('resize', this.setLayout);
  },

  setLayout: function () {
    this.setState({

      // West
      layoutWestWidth: LayoutUtils.getWestWidth(),

      layoutWestEastDividerLeft: LayoutUtils.getWestEastDividerLeft(),

      // East
      layoutEastLeft: LayoutUtils.getEastLeft(),
      layoutEastWidth: LayoutUtils.getEastWidth(),

      // North
      layoutNorthHeight: LayoutUtils.getNorthHeight(),

      layoutNorthSouthDividerTop: LayoutUtils.getNorthSouthDividerTop(),

      // South
      layoutSouthTop: LayoutUtils.getSouthTop(),
      layoutSouthHeight: LayoutUtils.getSouthHeight(),
      layoutSouthWidth: LayoutUtils.getSouthWidth(),

    });
  },

  handleLayoutWestEastDividerDragEnd: function (westEastDividerLeft) {
    this.setState({
      layoutWestWidth: westEastDividerLeft,
      layoutWestEastDividerLeft: westEastDividerLeft,
      layoutEastLeft: westEastDividerLeft + LayoutUtils.getDividerSize(),
      layoutEastWidth: LayoutUtils.getViewportWidth() - (westEastDividerLeft + LayoutUtils.getDividerSize()),
    });
  },

  handleLayoutNorthSourthDividerDragEnd: function (northSouthDividerTop) {
    this.setState({
      layoutNorthHeight: northSouthDividerTop - LayoutUtils.HEADER_BAR_HEIGHT,
      layoutNorthSouthDividerTop: northSouthDividerTop,
      layoutSouthTop: northSouthDividerTop + LayoutUtils.getDividerSize(),
      layoutSouthHeight: LayoutUtils.getViewportHeight() - (northSouthDividerTop + LayoutUtils.getDividerSize()),
    });
  },

  render: function () {
    return (
      <LayoutContainer>
        <LayoutNorth height={this.state.layoutNorthHeight}>
          <LayoutWest width={this.state.layoutWestWidth}>
            <WestContent
              width={this.state.layoutWestWidth}
              height={this.state.layoutNorthHeight} />
          </LayoutWest>
          <LayoutWestEastDivider
            left={this.state.layoutWestEastDividerLeft}
            containmentRight={this.state.layoutMiddleEastDividerLeft}
            onDragEnd={this.handleLayoutWestEastDividerDragEnd} />
          <LayoutEast left={this.state.layoutEastLeft} width={this.state.layoutEastWidth}>
            <EastContent
              width={this.state.layoutEastWidth}
              height={this.state.layoutNorthHeight} />
          </LayoutEast>
        </LayoutNorth>
        <LayoutNorthSouthDivider
          top={this.state.layoutNorthSouthDividerTop}
          onDragEnd={this.handleLayoutNorthSourthDividerDragEnd} />
        <LayoutSouth top={this.state.layoutSouthTop}>
          <Data height={this.state.layoutSouthHeight} width={this.state.layoutSouthWidth}/>
        </LayoutSouth>
      </LayoutContainer>
    );
  },

});

module.exports = Layout;
