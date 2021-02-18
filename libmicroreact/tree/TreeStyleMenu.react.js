import React from 'react';
import PropTypes from 'prop-types';

import ToggleSwitch from '../toggle-switch';
import Slider from '../slider';
import ControlsMenu from '../controls-menu';

import defaults from '../defaults';

const TreeStyleMenu = props => (
  <ControlsMenu
    className="scrollable-content"
    title="Nodes & labels"
  >
    <Slider
      id="tree-nodeSize"
      label="Node size"
      onChange={props.onNodeSizeChange}
      min={props.minNodeSize}
      max={props.maxNodeSize}
      value={props.nodeSize}
      unit="px"
    />
    <Slider
      id="tree-fontSize"
      label="Label size"
      onChange={props.onFontSizeChange}
      min={props.minFontSize}
      max={props.maxFontSize}
      value={props.fontSize}
      unit="px"
    />
    <hr />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Show leaf nodes"
      id="tree-styleLeafNodes"
      isChecked={props.styleLeafNodes}
      onChange={checked => props.onStyleLeafNodesChange(checked)}
    />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Show leaf borders"
      id="tree-renderLeafBorders"
      isChecked={props.renderLeafBorders}
      onChange={checked => props.onRenderLeafBordersChange(checked)}
    />
    <hr />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Show leaf labels"
      id="tree-renderLeafLabels"
      isChecked={props.renderLeafLabels}
      onChange={checked => props.onRenderLeafLabelsChange(checked)}
    />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Align leaf labels"
      id="tree-alignLabels"
      isChecked={props.alignLabels}
      onChange={checked => props.onAlignLabelsChange(checked)}
    />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Colour leaf labels"
      id="tree-styleLeafLabels"
      isChecked={props.styleLeafLabels}
      onChange={checked => props.onStyleLeafLabelsChange(checked)}
    />
    <hr />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Show internal nodes"
      id="tree-styleInternalNodes"
      isChecked={props.styleInternalNodes}
      onChange={checked => props.onStyleInternalNodesChange(checked)}
    />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Show internal labels"
      id="tree-renderInternalLabels"
      isChecked={props.renderInternalLabels}
      onChange={checked => props.onRenderInternalLabelsChange(checked)}
    />
    <ToggleSwitch
      className="mr-toggle-switch"
      label="Colour internal edges"
      id="tree-styleNodeLines"
      isChecked={props.styleNodeLines}
      onChange={checked => props.onStyleNodeLinesChange(checked)}
    />
  </ControlsMenu>
);

TreeStyleMenu.propTypes = {
  alignLabels: PropTypes.bool,
  fontSize: PropTypes.number.isRequired,
  maxFontSize: PropTypes.number.isRequired,
  maxNodeSize: PropTypes.number.isRequired,
  minFontSize: PropTypes.number.isRequired,
  minNodeSize: PropTypes.number.isRequired,
  nodeSize: PropTypes.number.isRequired,
  onAlignLabelsChange: PropTypes.func.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
  onNodeSizeChange: PropTypes.func.isRequired,
  onRenderInternalLabelsChange: PropTypes.func.isRequired,
  onRenderLeafBordersChange: PropTypes.func.isRequired,
  onRenderLeafLabelsChange: PropTypes.func.isRequired,
  onStyleInternalNodesChange: PropTypes.func.isRequired,
  onStyleLeafLabelsChange: PropTypes.func.isRequired,
  onStyleLeafNodesChange: PropTypes.func.isRequired,
  onStyleNodeLinesChange: PropTypes.func.isRequired,
  renderInternalLabels: PropTypes.bool,
  renderLeafBorders: PropTypes.bool,
  renderLeafLabels: PropTypes.bool,
  styleInternalNodes: PropTypes.bool,
  styleLeafLabels: PropTypes.bool,
  styleLeafNodes: PropTypes.bool,
  styleNodeLines: PropTypes.bool,
};

TreeStyleMenu.defaultProps = {
  fontSize: defaults.FONT_SIZE,
  maxFontSize: defaults.MAX_FONT_SIZE,
  maxNodeSize: defaults.MAX_NODE_SIZE,
  minFontSize: defaults.MIN_FONT_SIZE,
  minNodeSize: defaults.MIN_NODE_SIZE,
  nodeSize: defaults.NODE_SIZE,
};

export default TreeStyleMenu;

