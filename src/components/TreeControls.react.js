import React from 'react';
import assign from 'object-assign';

import { CGPS } from '../defaults';

const knobWidth = 60;
const knobPadding = 20;
const knobStyle = {
  min: 1,
  max: 50,
  width: knobWidth,
  angleOffset: -125,
  angleArc: 250,
  displayInput: false,
  fgColor: CGPS.COLOURS.PURPLE_LIGHT,
};

const treeSizeControlsStyle = {
  position: 'absolute',
  bottom: 8,
  left: `calc(50% - ${knobWidth + knobPadding}px)`,
  textAlign: 'left',
  zIndex: '999',
  userSelect: 'none',
};

const sizeControlStyle = {
  width: `${knobWidth + knobPadding}px`,
  height: `${knobWidth + knobPadding}px`,
  textAlign: 'center',
  display: 'inline-block',
  overflow: 'hidden',
  userSelect: 'none',
};

const noUserSelectStyle = {
  userSelect: 'none',
};

export default React.createClass({

  componentDidMount: function () {
    $('[data-dial-node-size]').knob(
      assign(knobStyle, {
        'change': (nodeSize) => {
          this.props.handleNodeSizeChange(nodeSize);
        },
      })
    );

    $('[data-dial-label-size]').knob(
      assign(knobStyle, {
        'change': (labelSize) => {
          this.props.handleLabelSizeChange(labelSize);
        },
      })
    );
  },

  render: function () {
    return (
      <div style={treeSizeControlsStyle}>
        <div style={sizeControlStyle}>
          <label>Node Size</label>
          <input type="text" data-dial-node-size defaultValue={this.props.nodeSize} style={noUserSelectStyle} />
        </div>
        <div style={sizeControlStyle}>
          <label>Label Size</label>
          <input type="text" data-dial-label-size defaultValue={this.props.labelSize} style={noUserSelectStyle} />
        </div>
      </div>
    );
  },

});
