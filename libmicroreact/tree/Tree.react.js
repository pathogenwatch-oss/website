import React from 'react';
import PropTypes from 'prop-types';
import phylocanvas from '@cgps/phylocanvas';
import contextMenuPlugin from '@cgps/phylocanvas-plugin-context-menu';
import interactionsPlugin from '@cgps/phylocanvas-plugin-interactions';
import metadataPlugin from '@cgps/phylocanvas-plugin-metadata';
import scalebarPlugin from '@cgps/phylocanvas-plugin-scalebar';
import svgExportPlugin from '@cgps/phylocanvas-plugin-svg-export';

import { PurePanel } from '../panel';
import SecondaryControls from './secondary-controls';
import StyleMenu from './TreeStyleMenu.react';
import ZoomControls from './TreeZoomControls.react';

import phylocanvasPlugin from './phylocanvas-plugin';
import { GeometricPoint } from '../utils/prop-types';

const noop = () => {};

export default class extends React.Component {
  static displayName = 'Tree';

  static propTypes = {
    ...PurePanel.panelProps,
    addExportCallback: PropTypes.func,
    filenames: PropTypes.object,
    height: PropTypes.number.isRequired,
    highlightedIds: PropTypes.array,
    lasso: PropTypes.bool,
    newickString: PropTypes.string,
    onAddHistoryEntry: PropTypes.func,
    onFilterChange: PropTypes.func,
    onLassoChange: PropTypes.func,
    onPhylocanvasInitialise: PropTypes.func,
    onPhylocanvasStateChange: PropTypes.func,
    onRedrawOriginalTree: PropTypes.func,
    path: PropTypes.arrayOf(GeometricPoint),
    phylocanvasState: PropTypes.object,
    removeExportCallback: PropTypes.func,
    setHighlightedIds: PropTypes.func,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    highlightedIds: [],
    lasso: false,
    onAddHistoryEntry: noop,
    onControlsVisibleChange: noop,
    onFilterChange: noop,
    onLassoChange: noop,
    onPhylocanvasInitialise: noop,
    onPhylocanvasStateChange: noop,
    onZoomModeChange: noop,
    setHighlightedIds: noop,
  }

  state = {
    controlsVisible: false,
  }

  componentDidMount() {
    let phylocanvasState = this.props.phylocanvasState;
    // for legacy viewPort-based snapshots
    if (phylocanvasState.viewPort && !phylocanvasState.size) {
      phylocanvasState = {
        ...phylocanvasState,
        ...phylocanvas.utils.restoreViewport(
          phylocanvasState.viewPort,
          phylocanvasState.padding,
          this.props.width,
          this.props.height
        ),
      };
    }

    this.tree = phylocanvas.createTree(this.canvasRef, phylocanvasState, [
      contextMenuPlugin, // must appear before interactions
      metadataPlugin,
      scalebarPlugin,
      svgExportPlugin,
      phylocanvasPlugin(this),
      interactionsPlugin,
    ]);

    this.onInitialise();

    const { addExportCallback } = this.props;
    if (addExportCallback) {
      addExportCallback('tree-png', () => this.tree.exportPNG());
      addExportCallback('tree-svg', () => this.tree.exportSerialisedSVG());
      addExportCallback('tree-nwk', () => this.tree.getNewick());
    }

    if (process.env.NODE_ENV !== 'production') {
      window.cgps_microreact_tree = this;
      window.cgps_microreact_phylocanvas = this.tree;
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      this.resizeTree();
    }

    if (prevProps.lasso !== this.props.lasso) {
      this.tree.lasso.setActive(this.props.lasso);
    }

    if (prevProps.path !== this.props.path) {
      this.tree.lasso.setPath(this.props.path);
    }

    if (prevProps.filenames !== this.props.filenames) {
      this.tree.contextMenu.filenames = this.props.filenames;
    }

    let initialised = false;
    if (prevProps.phylocanvasState !== this.props.phylocanvasState) {
      this.tree.mergeState(this.props.phylocanvasState);

      if (this.tree.isUninitialised()) {
        const { source } = this.props.phylocanvasState;
        this.tree.setSource(source);
        initialised = true;
      }
    }

    this.tree.render();

    if (initialised) {
      this.onInitialise();
    }
  }

  componentWillUnmount() {
    if (this.tree.lasso) {
      this.tree.lasso.destroy();
    }

    if (this.tree) {
      this.tree.destroy();
    }

    const { removeExportCallback } = this.props;
    if (removeExportCallback) {
      removeExportCallback('tree-png');
      removeExportCallback('tree-svg');
    }
  }

  onInitialise() {
    if (this.props.onPhylocanvasInitialise) {
      setTimeout(
        () =>
          this.props.onPhylocanvasInitialise(this.tree.ctx.canvas.toDataURL()),
        0
      );
    }
  }

  getMainAxis() {
    if (this.tree) {
      const treeType = phylocanvas.types[this.tree.state.type];
      return treeType ? treeType.mainAxis : undefined;
    }
    return undefined;
  }

  resizeTree() {
    this.tree.resize(this.props.width, this.props.height);
  }

  toggleStyleInternalNodes(styleInternalNodes) {
    this.tree.setState({
      styleInternalNodes,
      internalNodeStyle: { shape: styleInternalNodes ? 'circle' : 'none' },
    });
  }

  render() {
    const { width, height, phylocanvasState } = this.props;
    const { controlsVisible } = this.state;
    return (
      <PurePanel
        controlsVisible={controlsVisible}
        onControlsVisibleChange={() => this.setState({ controlsVisible: !controlsVisible })}
        primaryControls={
          <div className="libmr-ControlsMenu-group">
            <StyleMenu
              alignLabels={phylocanvasState.alignLabels}
              fontSize={phylocanvasState.fontSize}
              maxFontSize={this.props.maxFontSize}
              maxNodeSize={this.props.maxNodeSize}
              minFontSize={this.props.minFontSize}
              minNodeSize={this.props.minNodeSize}
              nodeSize={phylocanvasState.nodeSize}
              onAlignLabelsChange={(alignLabels) => this.tree.setState({ alignLabels })}
              onFontSizeChange={(fontSize) => this.tree.setState({ fontSize })}
              onNodeSizeChange={(nodeSize) => this.tree.setState({ nodeSize })}
              onRenderInternalLabelsChange={(renderInternalLabels) => this.tree.setState({ renderInternalLabels })}
              onRenderLeafBordersChange={(renderLeafBorders) => this.tree.setState({ renderLeafBorders })}
              onRenderLeafLabelsChange={(renderLeafLabels) => this.tree.setState({ renderLeafLabels })}
              onStyleInternalNodesChange={(styleInternalNodes) => this.toggleStyleInternalNodes(styleInternalNodes)}
              onStyleLeafLabelsChange={(styleLeafLabels) => this.tree.setState({ styleLeafLabels })}
              onStyleLeafNodesChange={(styleLeafNodes) => this.tree.setState({ styleLeafNodes })}
              onStyleNodeLinesChange={(styleNodeLines) => this.tree.setState({ styleNodeLines })}
              renderInternalLabels={phylocanvasState.renderInternalLabels}
              renderLeafBorders={phylocanvasState.renderLeafBorders}
              renderLeafLabels={phylocanvasState.renderLeafLabels}
              styleInternalNodes={phylocanvasState.styleInternalNodes}
              styleLeafLabels={phylocanvasState.styleLeafLabels}
              styleLeafNodes={phylocanvasState.styleLeafNodes}
              styleNodeLines={phylocanvasState.styleNodeLines}
              theme={this.props.theme}
            />
            {this.props.primaryControls}
          </div>
        }
        secondaryControls={
          <SecondaryControls
            lasso={this.props.lasso}
            onLassoChange={this.props.onLassoChange}
            onTypeChange={type => this.tree.setTreeType(type)}
            type={phylocanvasState.type}
          />
        }
        style={{ width, height, ...this.props.style }}
        theme={this.props.theme}
        zoomControls={
          <ZoomControls
            mainAxis={this.getMainAxis()}
            onZoomIn={() => this.tree.transform(0, 0, +1)}
            onZoomOut={() => this.tree.transform(0, 0, -1)}
            onHorizZoomIn={() => this.tree.changeBranchScale(+1)}
            onHorizZoomOut={() => this.tree.changeBranchScale(-1)}
            onVertZoomIn={() => this.tree.changeStepScale(+1)}
            onVertZoomOut={() => this.tree.changeStepScale(-1)}
            theme={this.props.theme}
          />
        }
      >
        <div
          className="libmr-Tree"
          style={{ width, height }}
        >
          {React.Children.map(
            this.props.children,
            child => (
              React.isValidElement(child) ?
                React.cloneElement(child, { controlsVisible }) :
                child
            )
          )}
          <canvas ref={c => { this.canvasRef = c; }} width={width} height={height} />
        </div>
      </PurePanel>
    );
  }
}
