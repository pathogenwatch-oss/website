import React from 'react';

const treeSizeControlsStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
  display: 'flex',
  textAlign: 'left',
  zIndex: '999',
  userSelect: 'none',
};

const sizeControlStyle = {
  width: '128px',
  height: '40px',
  textAlign: 'center',
  display: 'inline-block',
  overflow: 'hidden',
  userSelect: 'none',
};

export default React.createClass({

  propTypes: {
    nodeSize: React.PropTypes.number,
    labelSize: React.PropTypes.number,
    handleNodeSizeChange: React.PropTypes.func,
    handleLabelSizeChange: React.PropTypes.func,
  },

  componentDidMount: function () {
    componentHandler.upgradeElement(React.findDOMNode(this.refs.controls));
  },

  render: function () {
    return (
      <div ref="controls" style={treeSizeControlsStyle}>
        <div className="wgsa-tree-control" style={sizeControlStyle}>
          <label>Node Size
            <input type="range" onChange={this.props.handleNodeSizeChange}
              min="1" max="50" defaultValue={this.props.nodeSize}
              className="mdl-slider mdl-js-slider" tabIndex="0"/>
          </label>
        </div>
        <div className="wgsa-tree-control" style={sizeControlStyle}>
          <label>Label Size
            <input type="range" onChange={this.props.handleLabelSizeChange}
              min="1" max="50" defaultValue={this.props.labelSize}
              className="mdl-slider mdl-js-slider" tabIndex="0"/>
          </label>
        </div>
      </div>
    );
  },

});
