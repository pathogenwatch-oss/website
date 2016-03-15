import React from 'react';

import LayoutDivider from './LayoutDivider.react';
import TableSwitcher from '../TableSwitcher.js';

import LayoutUtils from '^/utils/Layout';
import Species from '^/species';

const style = {
  width: '100%',
  height: '100%',
};

export default React.createClass({

  propTypes: {
    top: React.PropTypes.number.isRequired,
    onDragEnd: React.PropTypes.func.isRequired,
  },

  componentDidMount() {
    $('.northSouthDivider').draggable({
      containment: [
        // x1
        0,
        // y1
        LayoutUtils.HEADER_BAR_HEIGHT,
        // x2
        LayoutUtils.getViewportWidth(),
        // y2
        LayoutUtils.getViewportHeight(),
      ],
      axis: 'y',
      scroll: false,
      cursor: 'grabbing',
      stop: (event, ui) => {
        const { HEADER_BAR_HEIGHT } = LayoutUtils;
        const top = Math.max(HEADER_BAR_HEIGHT, ui.offset.top);
        this.props.onDragEnd(top - HEADER_BAR_HEIGHT);
        if (top === HEADER_BAR_HEIGHT) this.forceUpdate();
      },
    });
  },

  componentDidUpdate() {
    $('.northSouthDivider').draggable( 'option', 'containment', [
      // x1
      0,
      // y1
      LayoutUtils.HEADER_BAR_HEIGHT,
      // x2
      LayoutUtils.getViewportWidth(),
      // y2
      LayoutUtils.getViewportHeight(),
    ]);
  },

  render() {
    return (
      <div style={style}>
        <LayoutDivider
          top={this.props.top}
          direction="horizontal"
          isStatic={true} />
        <LayoutDivider
          top={this.props.top}
          direction="horizontal"
          className="northSouthDivider" />
        { Species.missingAnalyses.indexOf('PAARSNP') === -1 ?
          <TableSwitcher
            top={this.props.top}
            showTimeline={this.props.showTimeline}
            shortCollectionId={this.props.shortCollectionId}
            onLayoutNavigationChange={this.props.onLayoutNavigationChange} />
          : null
        }
      </div>
    );
  },

});
