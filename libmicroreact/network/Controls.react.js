import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../controls-menu';
import ToggleSwitch from '../toggle-switch';
import Slider from '../slider';

export default class extends React.Component {

  static displayName = 'NetworkControlsMenu'

  static propTypes = {
    labelSize: PropTypes.number.isRequired,
    maxLabelSize: PropTypes.number.isRequired,
    maxNodeSize: PropTypes.number.isRequired,
    minLabelSize: PropTypes.number.isRequired,
    minNodeSize: PropTypes.number.isRequired,
    nodeSize: PropTypes.number.isRequired,
    onLabelSizeChange: PropTypes.func.isRequired,
    onNodeSizeChange: PropTypes.func.isRequired,
    onShowLabelsChange: PropTypes.func,
    onShowNodesChange: PropTypes.func,
    showLabels: PropTypes.bool,
    showNodes: PropTypes.bool,
  }

  state = {
    isOpen: false,
  }

  render() {
    const { props } = this;
    return (
      <Menu
        className="mr-menu mr-tree-styles-menu"
        open={this.state.isOpen}
        title="Nodes & Labels"
        toggle={() => this.setState({ isOpen: !this.state.isOpen })}
      >
        <Slider
          label="Node Size"
          onChange={props.onNodeSizeChange}
          min={props.minNodeSize}
          max={props.maxNodeSize}
          value={props.nodeSize}
        />
        <Slider
          label="Label Size"
          onChange={props.onLabelSizeChange}
          min={props.minLabelSize}
          max={props.maxLabelSize}
          value={props.labelSize}
        />
        <hr />
        <ToggleSwitch
          className="mr-toggle-switch"
          label="Show Nodes"
          isChecked={props.showNodes}
          onChange={checked => props.onShowNodesChange(checked)}
        />
        <ToggleSwitch
          className="mr-toggle-switch"
          label="Show Labels"
          isChecked={props.showLabels}
          onChange={checked => props.onShowLabelsChange(checked)}
        />
      </Menu>
    );
  }

}
