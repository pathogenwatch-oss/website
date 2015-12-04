import React from 'react';
import { treeTypes } from 'phylocanvas';

const treeSizeControlsStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  zIndex: '1',
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
    treeType: React.PropTypes.string,
    handleNodeSizeChange: React.PropTypes.func,
    handleLabelSizeChange: React.PropTypes.func,
    handleTreeTypeChange: React.PropTypes.func,
  },

  componentDidMount() {
    const { nodeSlider, labelSlider } = this.refs;
    componentHandler.upgradeElements([ nodeSlider, labelSlider ]);
  },

  render() {
    return (
      <div style={treeSizeControlsStyle}>
        <select className="wgsa-select-tree-type" defaultValue={this.props.treeType} onChange={this.props.handleTreeTypeChange}>
          { Object.keys(treeTypes).map((treeType) => <option key={treeType} value={treeType}>{treeType}</option>)}
        </select>
        <div>
          <div className="wgsa-tree-control" style={sizeControlStyle}>
            <label>Node Size
              <input ref="nodeSlider" type="range"
                onChange={this.props.handleNodeSizeChange}
                min="1" max="50" value={this.props.nodeSize}
                className="mdl-slider mdl-js-slider" tabIndex="0"/>
            </label>
          </div>
          <div className="wgsa-tree-control" style={sizeControlStyle}>
            <label>Label Size
              <input ref="labelSlider" type="range"
                onChange={this.props.handleLabelSizeChange}
                min="1" max="50" value={this.props.labelSize}
                className="mdl-slider mdl-js-slider" tabIndex="0"/>
            </label>
          </div>
        </div>
      </div>
    );
  },

});
