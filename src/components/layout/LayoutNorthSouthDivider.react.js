import React from 'react';

import LayoutDivider from './LayoutDivider.react';
import LayoutNavigation from '../LayoutNavigation.react';

const style = {
  width: '100%',
  height: '100%',
};

export default React.createClass({

  propTypes: {
    top: React.PropTypes.number.isRequired,
    onDragEnd: React.PropTypes.func.isRequired,
  },

  componentDidMount: function () {
    this.initialize();
  },

  initialize: function () {
    $('.northSouthDivider').draggable({
      containment: 'body',
      axis: 'y',
      scroll: false,
      cursor: 'grabbing',
      stop: (event, ui) => {
        this.props.onDragEnd(ui.offset.top);
      },
    });
  },

  render: function () {
    return (
      <div style={style}>
        <LayoutDivider
          top={this.props.top}
          direction={'horizontal'}
          isStatic={true} />
        <LayoutDivider
          top={this.props.top}
          direction={'horizontal'}
          className={'northSouthDivider'} />
        <LayoutNavigation
          top={this.props.top}
          showTimeline={this.props.showTimeline}
          shortCollectionId={this.props.shortCollectionId}
          onLayoutNavigationChange={this.props.onLayoutNavigationChange} />
      </div>
    );
  },

});
