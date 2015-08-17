import React from 'react';

import Data from './Data.react';

import LayoutContainer from './layout/LayoutContainer.react';
import LayoutWest from './layout/LayoutWest.react';
import LayoutMiddle from './layout/LayoutMiddle.react';

import LayoutEast from './layout/LayoutEast.react';
import LayoutNorth from './layout/LayoutNorth.react';
import LayoutSouth from './layout/LayoutSouth.react';

import WestContent from './WestContent.react';
import MiddleContent from './MiddleContent.react';
import EastContent from './EastContent.react';

import LayoutWestMiddleDivider from './layout/LayoutWestMiddleDivider.react';
import LayoutMiddleEastDivider from './layout/LayoutMiddleEastDivider.react';
import LayoutNorthSouthDivider from './layout/LayoutNorthSouthDivider.react';

import LayoutUtils from '../utils/Layout';
import DataUtils from '../utils/Data';

import DEFAULT from '../defaults.js';

const Layout = React.createClass({

  getInitialState: function () {
    return {
      layoutWestWidth: 0,

      layoutWestMiddleDividerLeft: 0,

      layoutMiddleLeft: 0,
      layoutMiddleWidth: 0,

      layoutMiddleEastDividerLeft: 0,

      layoutEastLeft: 0,
      layoutEastWidth: 0,

      layoutNorthHeight: 0,

      layoutNorthSouthDividerTop: 0,

      layoutSouthTop: 0,
      layoutSouthHeight: 0,

      layoutNavigation: 'table',
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

      layoutWestMiddleDividerLeft: LayoutUtils.getWestMiddleDividerLeft(),

      // Middle
      layoutMiddleLeft: LayoutUtils.getMiddleLeft(),
      layoutMiddleWidth: LayoutUtils.getMiddleWidth(),

      layoutMiddleEastDividerLeft: LayoutUtils.getMiddleEastDividerLeft(),

      // East
      layoutEastLeft: LayoutUtils.getEastLeft(),
      layoutEastWidth: LayoutUtils.getEastWidth(),

      // North
      layoutNorthHeight: LayoutUtils.getNorthHeight(),

      layoutNorthSouthDividerTop: LayoutUtils.getNorthSouthDividerTop(),

      // South
      layoutSouthTop: LayoutUtils.getSouthTop(),
      layoutSouthHeight: LayoutUtils.getSouthHeight(),

    });
  },

  handleLayoutWestMiddleDividerDragEnd: function (westMiddleDividerLeft) {
    this.setState({
      layoutWestWidth: westMiddleDividerLeft,
      layoutWestMiddleDividerLeft: westMiddleDividerLeft,
      layoutMiddleLeft: westMiddleDividerLeft + LayoutUtils.getDividerSize(),
      layoutMiddleWidth: this.state.layoutMiddleEastDividerLeft - westMiddleDividerLeft - LayoutUtils.getDividerSize(),
    });
  },

  handleLayoutMiddleEastDividerDragEnd: function (middleEastDividerLeft) {
    this.setState({
      layoutMiddleWidth: middleEastDividerLeft - this.state.layoutMiddleLeft,
      layoutMiddleEastDividerLeft: middleEastDividerLeft,
      layoutEastLeft: middleEastDividerLeft + LayoutUtils.getDividerSize(),
      layoutEastWidth: LayoutUtils.getViewportWidth() - (middleEastDividerLeft + LayoutUtils.getDividerSize()),
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

  handleLayoutNavigationChange: function (layoutNavigation) {
    this.setState({
      layoutNavigation: layoutNavigation,
    });
  },

  showTimeline: function () {
    var dataObjects = DataUtils.convertDataObjectToArray(this.props.isolates);
    return DataUtils.dataHasDateMetaFields(dataObjects);
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
          <LayoutWestMiddleDivider
            left={this.state.layoutWestMiddleDividerLeft}
            containmentRight={this.state.layoutMiddleEastDividerLeft}
            layoutMiddleEastDividerLeft={this.state.layoutMiddleEastDividerLeft}
            onDragEnd={this.handleLayoutWestMiddleDividerDragEnd} />
          <LayoutMiddle left={this.state.layoutMiddleLeft} width={this.state.layoutMiddleWidth}>
            <MiddleContent
              width={this.state.layoutMiddleWidth}
              height={this.state.layoutNorthHeight} />
          </LayoutMiddle>
          <LayoutMiddleEastDivider
            left={this.state.layoutMiddleEastDividerLeft}
            containmentLeft={this.state.layoutMiddleLeft}
            layoutWestMiddleDividerLeft={this.state.layoutWestMiddleDividerLeft}
            onDragEnd={this.handleLayoutMiddleEastDividerDragEnd} />
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
          <Data />
        </LayoutSouth>
      </LayoutContainer>
    );
  },

});

module.exports = Layout;
