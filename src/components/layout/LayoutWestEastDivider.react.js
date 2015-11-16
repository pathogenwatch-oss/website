import React from 'react';
import LayoutUtils from '../../utils/Layout';
import LayoutDivider from './LayoutDivider.react';

const style = {
  width: '100%',
  height: '100%',
};

export default React.createClass({

  displayName: 'LayoutWestEastDivider',

  propTypes: {
    left: React.PropTypes.number.isRequired,
    onDragEnd: React.PropTypes.func.isRequired,
  },

  componentDidMount() {
    $('.westEastDivider').draggable({
      containment: [
        // x1
        0,
        // y1
        LayoutUtils.getNorthHeight(),
        // x2
        LayoutUtils.getViewportWidth() - LayoutUtils.getDividerSize(),
        // y2
        0,
      ],
      axis: 'x',
      scroll: false,
      cursor: 'grabbing',
      stop: (event, ui) => {
        this.props.onDragEnd(ui.offset.left);
      },
    });
  },

  componentDidUpdate() {
    $('.westEastDivider').draggable( 'option', 'containment', [
      // x1
      0,
      // y1
      LayoutUtils.getNorthHeight(),
      // x2
      LayoutUtils.getViewportWidth() - LayoutUtils.getDividerSize(),
      // y2
      0,
    ]);
  },

  render() {
    return (
      <div style={style}>
        <LayoutDivider
          left={this.props.left}
          direction={'vertical'}
          isStatic={true} />

        <LayoutDivider
          left={this.props.left}
          direction={'vertical'}
          className={'westEastDivider'} />
      </div>
    );
  },

});
