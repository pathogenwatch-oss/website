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
    scales: React.PropTypes.object,
    treeType: React.PropTypes.string,
    handleNodeScaleChange: React.PropTypes.func,
    handleLabelScaleChange: React.PropTypes.func,
    handleTreeTypeChange: React.PropTypes.func,
  },

  componentDidMount() {
    const { nodeSlider, labelSlider } = this.refs;
    componentHandler.upgradeElements([ nodeSlider, labelSlider ]);
  },

  componentDidUpdate(previous) {
    const { nodeSlider, labelSlider } = this.refs;
    const { scales } = this.props;

    if (scales !== previous.scales) {
      nodeSlider.MaterialSlider.change(scales.node);
      labelSlider.MaterialSlider.change(scales.label);
    }
  },

  render() {
    const { scales } = this.props;

    return (
      <div style={treeSizeControlsStyle}>
        <select className="wgsa-select-tree-type" defaultValue={this.props.treeType} onChange={this.props.handleTreeTypeChange}>
          { Object.keys(treeTypes).map((treeType) => <option key={treeType} value={treeType}>{treeType}</option>)}
        </select>
        <div>
          <div className="wgsa-tree-control" style={sizeControlStyle}>
            <label>Node Size
              <input ref="nodeSlider" type="range"
                onChange={this.props.handleNodeScaleChange}
                min="0.1" max={scales.max} step="0.1" defaultValue={scales.node}
                className="mdl-slider mdl-js-slider" tabIndex="0"/>
            </label>
          </div>
          <div className="wgsa-tree-control" style={sizeControlStyle}>
            <label>Label Size
              <input ref="labelSlider" type="range"
                onChange={this.props.handleLabelScaleChange}
                min="0.1" max={scales.max} step="0.1" defaultValue={scales.leaf}
                className="mdl-slider mdl-js-slider" tabIndex="0"/>
            </label>
          </div>
        </div>
      </div>
    );
  },

});
