import React from 'react';
import { treeTypes } from 'phylocanvas';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { isLoaded, getVisibleTree, getTreeState } from './selectors';
import { setNodeScale, setLabelScale } from './actions';

const Controls = createClass({

  propTypes: {
    visible: PropTypes.bool,
    scales: PropTypes.object,
    treeType: PropTypes.string,
    onNodeScaleChange: PropTypes.func,
    onLabelScaleChange: PropTypes.func,
    onTreeTypeChange: PropTypes.func,
  },

  componentDidMount() {
    const { nodeSlider, labelSlider } = this.refs;
    componentHandler.upgradeElements([ nodeSlider, labelSlider ]);
  },

  componentDidUpdate(previous) {
    const { nodeSlider, labelSlider } = this.refs;
    const { phylocanvas, nodeSize, labelSize } = this.props;

    if (nodeSize !== previous.nodeSize) {
      const { scale, base } = nodeSize;
      nodeSlider.MaterialSlider.change(scale);
      phylocanvas.baseNodeSize = base * scale;
    }

    if (labelSize !== previous.labelSize) {
      const { scale, base } = labelSize;
      labelSlider.MaterialSlider.change(scale);
      phylocanvas.textSize = base * scale;
    }

    if (nodeSize !== previous.nodeSize || labelSize !== previous.labelSize) {
      phylocanvas.draw();
    }
  },

  render() {
    const { visible, nodeSize, labelSize, phylocanvas } = this.props;

    return (
      <div className={classnames('wgsa-pane-controls', `wgsa-pane-controls--${visible ? 'visible' : 'hidden'}`)}>
        <select className="wgsa-select-tree-type wgsa-pane-overlay"
          value={this.props.treeType}
          onChange={event => phylocanvas.setTreeType(event.target.value)}
        >
          { Object.keys(treeTypes).map((treeType) =>
            <option key={treeType} value={treeType}>{treeType}</option>
          )}
        </select>
        <div className="wgsa-pane-controls__row wgsa-pane-overlay">
          <div className="wgsa-pane-slider">
            <label>Node Size
              <input ref="nodeSlider" type="range"
                onChange={this.props.onNodeScaleChange}
                min="0" max={nodeSize.max} step="0.1" value={nodeSize.scale || 1}
                className="mdl-slider mdl-js-slider" tabIndex="0"
              />
            </label>
          </div>
          <div className="wgsa-pane-slider">
            <label>Label Size
              <input ref="labelSlider" type="range"
                onChange={this.props.onLabelScaleChange}
                min="0" max={labelSize.max} step="0.1" value={labelSize.scale || 1}
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
    tree: getTreeState(state).visible,
    nodeSize: getVisibleTree(state).nodeSize,
    labelSize: getVisibleTree(state).labelSize,
    treeType: getVisibleTree(state).type,
  };
}

function mapDispatchToProps(dispatch, { stateKey }) {
  return {
    onNodeScaleChange: event =>
      dispatch(setNodeScale(stateKey, event.target.value)),
    onLabelScaleChange: event =>
      dispatch(setLabelScale(stateKey, event.target.value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
