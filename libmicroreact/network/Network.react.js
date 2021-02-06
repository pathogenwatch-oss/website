/* global sigma */
/* eslint new-cap: */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash.debounce';

import Panel from '../panel';
import LassoButton from '../lasso-button';
import ControlsButton from '../controls-button';

import createSigmaLasso from './sigma-lasso';
import { exportPNG, exportSVG } from './export';

import { nodeRenderer, edgeRenderer } from './renderers';

sigma.canvas.nodes.def = nodeRenderer;
sigma.canvas.edges.def = edgeRenderer;

class Network extends React.Component {
  static propTypes = {
    addExportCallback: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    draggableNodes: PropTypes.bool,
    edgeColour: PropTypes.string,
    fontFamily: PropTypes.string,
    graph: PropTypes.shape({ edges: PropTypes.array, nodes: PropTypes.array }),
    hasLasso: PropTypes.bool,
    height: PropTypes.number,
    labelColour: PropTypes.string,
    labelSize: PropTypes.number,
    lassoActive: PropTypes.bool,
    lassoPath: PropTypes.array,
    layoutDuration: PropTypes.number,
    layoutSettings: PropTypes.object,
    minNodeSize: PropTypes.number,
    nodeColour: PropTypes.string,
    nodeRenderer: PropTypes.func,
    nodeSize: PropTypes.number,
    onLassoActiveChange: PropTypes.func,
    onLassoPathChange: PropTypes.func,
    onLayoutChange: PropTypes.func,
    onLayoutStart: PropTypes.func,
    onNodeHover: PropTypes.func,
    onNodeLeave: PropTypes.func,
    onNodeSelect: PropTypes.func,
    onViewportChange: PropTypes.func,
    primaryControls: PropTypes.node,
    recomputeLayout: PropTypes.bool,
    removeExportCallback: PropTypes.func,
    secondaryControls: PropTypes.node,
    settings: PropTypes.object,
    showLabels: PropTypes.bool,
    showNodes: PropTypes.bool,
    style: PropTypes.object,
    viewport: PropTypes.object,
    width: PropTypes.number,
  }

  static defaultProps = {
    draggableNodes: false,
    edgeColour: '#ccc',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    hasLasso: false,
    labelColour: '#222',
    labelSize: 14,
    layoutDuration: 1000,
    maxLabelSize: 160,
    minNodeSize: 1,
    nodeColour: '#ccc',
    nodeSize: 16,
    secondaryControls: [],
    showLabels: true,
    showNodes: true,
  }

  componentDidMount() {
    this.sigmaInst = new sigma({
      graph: this.props.graph,
      renderer: {
        container: this.el,
        type: 'canvas',
      },
      settings: {
        defaultEdgeColor: this.props.edgeColour,
        defaultLabelSize: this.props.labelSize,
        defaultNodeColour: this.props.labelSize,
        drawLabels: this.props.showLabels,
        drawNodes: this.props.showNodes,
        font: this.props.fontFamily,
        maxNodeSize: this.props.nodeSize / 2,
        minNodeSize: this.props.minNodeSize,
        nodeColor: this.props.nodeColour,
        sideMargin: 1,
        ...this.props.settings,
      },
    });

    const area = this.sigmaInst.renderers[0].camera.quadtree.area;
    this.sigmaInst.renderers[0].camera.quadtree.area = (...args) => {
      const nodes = area.apply(this.sigmaInst.renderers[0].camera.quadtree, args);
      return nodes.sort((a, b) => {
        if (a.isHighlighted && !b.isHighlighted) return 1;
        if (!a.isHighlighted && b.isHighlighted) return -1;
        return 0;
      });
    };

    if (this.props.draggableNodes) {
      sigma.plugins.dragNodes(this.sigmaInst, this.sigmaInst.renderers[0]);
    }

    this.sigmaInst.initalZoomRatio = this.sigmaInst.settings('zoomingRatio');

    if (this.props.onViewportChange) {
      this.sigmaInst.camera.bind(
        'coordinatesUpdated',
        debounce(
          () => this.props.onViewportChange(this.saveViewport()),
          200 /* same as Sigma's mouseZoomDuration and doubleClickZoomDuration */
        )
      );
    }

    if (this.props.onNodeSelect) {
      this.sigmaInst.bind('clickNodes', event => this.handleNodeClick(event));
      this.sigmaInst.bind('clickStage', event => this.handleStageClick(event));
    }

    this.sigmaInst.bind('overNode', event => {
      const { data } = event;
      if (data.node.hoverLabel && data.node.isActive !== false) {
        data.node.label = data.node.hoverLabel;
        this.sigmaInst.refresh();
      }
      if (this.props.onNodeHover) {
        this.props.onNodeHover(event);
      }
    });

    this.sigmaInst.bind('outNode', event => {
      const { data } = event;
      if (data.node.hoverLabel && data.node.label) {
        data.node.label = undefined;
        this.sigmaInst.refresh();
      }
      if (this.props.onNodeLeave) {
        this.props.onNodeLeave(event);
      }
    });

    if (this.props.hasLasso) {
      this.canvasLasso = createSigmaLasso(this.sigmaInst, {
        isActive: this.props.lassoActive,
        path: this.props.lassoPath,
        onPathChange: (path) => this.props.onLassoPathChange(path),
      });
      this.sigmaInst.canvasLasso = this.canvasLasso;
    }

    const renderer = this.sigmaInst.renderers[0];
    // Keep renderer's keys on the sigma instance to allow custom renderers to access them
    this.sigmaInst.settings('rendererXKey', `${renderer.options.prefix}x`);
    this.sigmaInst.settings('rendererYKey', `${renderer.options.prefix}y`);
    this.sigmaInst.settings('rendererSizeKey', `${renderer.options.prefix}size`);
    this.sigmaInst.settings('_camera', this.sigmaInst.camera);

    if (this.props.viewport) {
      this.restoreViewport(this.props.viewport);
    }

    if (this.props.recomputeLayout) {
      this.startLayout();
    } else {
      this.sigmaInst.refresh();
    }

    const { addExportCallback } = this.props;
    if (addExportCallback) {
      addExportCallback('network-png', () => exportPNG(this.sigmaInst));
      addExportCallback('network-svg', () => exportSVG(this.sigmaInst));
    }

    if (process.env.NODE_ENV !== 'production') {
      window.sigmaInst = this.sigmaInst;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showLabels !== this.props.showLabels) {
      this.sigmaInst.settings('drawLabels', this.props.showLabels);
    }

    if (prevProps.showNodes !== this.props.showNodes) {
      this.sigmaInst.settings('drawNodes', this.props.showNodes);
    }

    if (prevProps.nodeSize !== this.props.nodeSize) {
      this.sigmaInst.settings('maxNodeSize', this.props.nodeSize / 2);
    }

    if (this.props.graph !== prevProps.graph) {
      this.sigmaInst.graph.clear();
      this.sigmaInst.graph.read(this.props.graph);
    }

    if (prevProps.lassoActive !== this.props.lassoActive) {
      this.canvasLasso.setActive(this.props.lassoActive);
    }

    if (prevProps.lassoPath !== this.props.lassoPath) {
      this.canvasLasso.setPath(this.props.lassoPath);
    }

    this.sigmaInst.refresh();
  }

  componentWillUnmount() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }

    // if (this.props.onViewportChange) {
    //   this.props.onViewportChange(this.saveViewport());
    // }

    if (this.canvasLasso) {
      this.canvasLasso.destroy();
    }
    if (this.sigmaInst) {
      this.sigmaInst.kill();
    }

    const { removeExportCallback } = this.props;
    if (removeExportCallback) {
      removeExportCallback('network-png');
      removeExportCallback('network-svg');
    }
  }

  getNodeNeighbours(nodeIds) {
    const neighbours = new Set();
    for (const nodeId of nodeIds) {
      neighbours.add(nodeId);
      this.props.graph.edges.forEach(edge => {
        if (edge.source === nodeId) {
          neighbours.add(edge.target);
        }
        if (edge.target === nodeId) {
          neighbours.add(edge.source);
        }
      });
    }
    return Array.from(neighbours);
  }

  getNodeComponent(nodeIds) {
    const queue = nodeIds;
    const visited = new Set();
    while (queue.length) {
      const nodeId = queue.pop();
      visited.add(nodeId);
      this.props.graph.edges.forEach(edge => {
        if (edge.source === nodeId && !visited.has(edge.target)) {
          queue.push(edge.target);
        }
        if (edge.target === nodeId && !visited.has(edge.source)) {
          queue.push(edge.source);
        }
      });
    }
    return Array.from(visited);
  }

  startLayout() {
    if (!this.sigmaInst || this.sigmaInst.isForceAtlas2Running()) {
      return;
    }

    if (this.props.onLayoutStart) {
      this.props.onLayoutStart();
    }

    this.sigmaInst.renderers[0].settings('drawEdges', false);
    this.sigmaInst.startForceAtlas2({
      worker: true,
      barnesHutOptimize: false,
      ...this.props.layoutSettings,
    });

    this.timeoutID = setTimeout(() => this.stopLayout(), this.props.layoutDuration);
  }

  stopLayout() {
    if (!this.sigmaInst || !this.sigmaInst.isForceAtlas2Running()) {
      return;
    }
    this.sigmaInst.renderers[0].settings('drawEdges', true);
    this.sigmaInst.stopForceAtlas2();

    const nodes = this.sigmaInst.graph.nodes();
    const layout = {};
    for (const node of nodes) {
      layout[node.id] = {
        x: node.x,
        y: node.y,
      };
    }

    if (this.props.onLayoutChange) {
      this.props.onLayoutChange(layout);
    }
  }

  handleNodeClick(event) {
    const ctrlKey = event.data.captor.metaKey || event.data.captor.ctrlKey;
    const altKey = event.data.captor.altKey || event.data.captor.shiftKey;
    const clickedNodeIds = event.data.node.map(node => node.id);
    if (altKey && ctrlKey) {
      const ids = this.getNodeComponent(clickedNodeIds);
      this.props.onNodeSelect(ids);
    } else if (altKey) {
      const ids = this.getNodeNeighbours(clickedNodeIds);
      this.props.onNodeSelect(ids, ctrlKey);
    } else {
      this.props.onNodeSelect(clickedNodeIds, ctrlKey);
    }
  }

  handleStageClick(event) {
    const { isDragging, metaKey, ctrlKey } = event.data.captor;
    const append = metaKey || ctrlKey;

    if (!isDragging && !append) {
      this.props.onNodeSelect();
    }
  }

  handleZoomChange(delta) {
    const ratio = this.sigmaInst.settings('zoomingRatio') ** -delta;
    const animation = { duration: this.sigmaInst.settings('mouseZoomDuration') };
    sigma.utils.zoomTo(this.sigmaInst.camera, 0, 0, ratio, animation);
  }

  handleZoomReset() {
    const animation = { duration: this.sigmaInst.settings('mouseZoomDuration') };
    sigma.utils.zoomTo(this.sigmaInst.camera, 0, 0, 1 / this.sigmaInst.camera.ratio, animation);
  }

  saveViewport() {
    return {
      x: this.sigmaInst.camera.x,
      y: this.sigmaInst.camera.y,
      ratio: this.sigmaInst.camera.ratio,
    };
  }

  restoreViewport(viewport) {
    this.sigmaInst.camera.x = viewport.x;
    this.sigmaInst.camera.y = viewport.y;
    this.sigmaInst.camera.ratio = viewport.ratio;
  }

  renderSecondaryControls() {
    return (
      <React.Fragment>
        {
          this.props.hasLasso &&
          <LassoButton
            active={this.props.lassoActive}
            onClick={() => this.props.onLassoActiveChange(!this.props.lassoActive)}
          />
        }
        <ControlsButton
          title="Shuffle nodes"
          onClick={() => this.startLayout()}
        >
          <i className="material-icons">shuffle</i>
        </ControlsButton>
        <ControlsButton
          title="Reset zoom"
          onClick={() => this.handleZoomReset()}
        >
          <i className="material-icons">zoom_out_map</i>
        </ControlsButton>
        { this.props.secondaryControls }
      </React.Fragment>
    );
  }

  render() {
    const { width, height } = this.props;
    return (
      <Panel
        primaryControls={this.props.primaryControls}
        onZoomChange={(delta) => this.handleZoomChange(delta)}
        secondaryControls={this.renderSecondaryControls()}
        style={{ width, height, ...this.props.style }}
      >
        <div
          className={classnames('libmr-Network', this.props.className)}
          ref={ el => { this.el = el; } }
          style={{ width, height, ...this.props.style }}
        >
          { this.props.children }
        </div>
      </Panel>
    );
  }
}

export default Network;
