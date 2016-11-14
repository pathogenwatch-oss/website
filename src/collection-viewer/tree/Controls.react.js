import React from 'react';
import { treeTypes } from 'phylocanvas';
import { connect } from 'react-redux';

import { isLoaded, getTreeType, getBaseSize, getTreeScales } from './selectors';
import { setTreeType, setNodeScale, setLabelScale } from './actions';

const Controls = React.createClass({

  propTypes: {
    scales: React.PropTypes.object,
    treeType: React.PropTypes.string,
    onNodeScaleChange: React.PropTypes.func,
    onLabelScaleChange: React.PropTypes.func,
    onTreeTypeChange: React.PropTypes.func,
  },

  componentDidMount() {
    const { nodeSlider, labelSlider } = this.refs;
    componentHandler.upgradeElements([ nodeSlider, labelSlider ]);
  },

  componentDidUpdate(previous) {
    const { nodeSlider, labelSlider } = this.refs;
    const { scales, treeType, baseSize, phylocanvas } = this.props;

    if (treeType !== previous.treeType || !previous.loaded) {
      phylocanvas.setTreeType(treeType);
    }

    if (baseSize && (scales !== previous.scales || !previous.loaded)) {
      nodeSlider.MaterialSlider.change(scales.node);
      phylocanvas.baseNodeSize = baseSize * scales.node;

      labelSlider.MaterialSlider.change(scales.label);
      phylocanvas.textSize = baseSize * scales.label;

      phylocanvas.draw();
    }
  },

  render() {
    const { scales } = this.props;

    return (
      <div className="wgsa-tree-controls">
        <select className="wgsa-select-tree-type wgsa-tree-overlay"
          value={this.props.treeType}
          onChange={this.props.onTreeTypeChange}
        >
          { Object.keys(treeTypes).map((treeType) =>
            <option key={treeType} value={treeType}>{treeType}</option>
          )}
        </select>
        <div className="wgsa-tree-sliders wgsa-tree-overlay">
          <div className="wgsa-tree-slider">
            <label>Node Size
              <input ref="nodeSlider" type="range"
                onChange={this.props.onNodeScaleChange}
                min="0.1" max={scales.max} step="0.2" value={scales.node}
                className="mdl-slider mdl-js-slider" tabIndex="0"
              />
            </label>
          </div>
          <div className="wgsa-tree-slider">
            <label>Label Size
              <input ref="labelSlider" type="range"
                onChange={this.props.onLabelScaleChange}
                min="0.1" max={scales.max} step="0.2" value={scales.leaf}
                className="mdl-slider mdl-js-slider" tabIndex="0"
              />
            </label>
          </div>
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    loaded: isLoaded(state),
    treeType: getTreeType(state),
    baseSize: getBaseSize(state),
    scales: getTreeScales(state),
  };
}

function mapDispatchToProps(dispatch, { stateKey }) {
  return {
    onTreeTypeChange: event =>
      dispatch(setTreeType(stateKey, event.target.value)),
    onNodeScaleChange: event =>
      dispatch(setNodeScale(stateKey, event.target.value)),
    onLabelScaleChange: event =>
      dispatch(setLabelScale(stateKey, event.target.value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
