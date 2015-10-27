import '../../css/tree.css';

import React from 'react';
import PhyloCanvas from 'PhyloCanvas';
import contextMenuPlugin from 'phylocanvas-plugin-context-menu';

import TreeControls from './TreeControls.react';
import TreeMenu from './TreeMenu.react';

import FilteredDataActionCreators from '../../actions/FilteredDataActionCreators';

import FilteredDataStore from '../../stores/FilteredDataStore';
import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';

import DEFAULT, { CGPS } from '../../defaults';

PhyloCanvas.plugin(contextMenuPlugin);

const fullWidthHeight = {
  height: '100%',
  width: '100%',
};

export default React.createClass({

  propTypes: {
    newick: React.PropTypes.string,
    title: React.PropTypes.string,
    navButton: React.PropTypes.element,
    styleTree: React.PropTypes.func,
    onUpdated: React.PropTypes.func,
    onRedrawOriginalTree: React.PropTypes.func,
    highlightFilteredNodes: React.PropTypes.func,
  },

  getInitialState() {
    return ({
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      nodeSize: DEFAULT.NODE_SIZE,
      labelSize: DEFAULT.LABEL_SIZE,
      labelGetter: FilteredDataStore.getLabelGetter(),
      colourColumnName: FilteredDataStore.getColourTableColumnName(),
      treeLoaded: false,
    });
  },

  componentDidMount() {
    // TODO: Un-hack this
    componentHandler.upgradeDom();

    FilteredDataStore.addChangeListener(this.handleFilteredDataStoreChange);

    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container', {
      contextMenu: {
        parent: document.body,
      },
    });

    phylocanvas.padding = 128;
    phylocanvas.showLabels = true;
    phylocanvas.hoverLabel = true;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.setTreeType(this.state.treeType);
    phylocanvas.setNodeSize(this.state.nodeSize);
    phylocanvas.setTextSize(this.state.labelSize);

    phylocanvas.on('subtree', () => {
      FilteredDataActionCreators.setBaseAssemblyIds(
        this.phylocanvas.leaves.map(_ => _.id)
      );
    });

    phylocanvas.on('original-tree', () => {
      this.styleTree();
      this.phylocanvas.fitInPanel();
      this.phylocanvas.draw();

      this.props.onRedrawOriginalTree();
    });

    this.phylocanvas = phylocanvas;

    this.loadTree();
  },

  componentWillUpdate() {
    this.phylocanvas.canvasEl.removeEventListener('updated', this.props.onUpdated);
  },

  componentDidUpdate() {
    this.phylocanvas.resizeToContainer();

    this.phylocanvas.on('updated', this.props.onUpdated);

    if (this.props.newick && this.props.newick !== this.phylocanvas.stringRepresentation) {
      this.loadTree();
    } else {
      this.styleTree();
      this.phylocanvas.draw();
    }
  },

  componentWillUnmount() {
    FilteredDataStore.removeChangeListener(this.handleFilteredDataStoreChange);
  },

  render() {
    const { title, navButton } = this.props;

    return (
      <section className="wgsa-tree">
        <header className="wgsa-tree-header">
          { navButton }
          <h2 className="wgsa-tree-heading">
            <span>{title}</span>
          </h2>
        </header>
        <div id="phylocanvas-container" style={fullWidthHeight}></div>
        <TreeControls
          treeType={this.state.treeType}
          nodeSize={this.state.nodeSize}
          labelSize={this.state.labelSize}
          handleTreeTypeChange={this.handleTreeTypeChange}
          handleNodeSizeChange={this.handleNodeSizeChange}
          handleLabelSizeChange={this.handleLabelSizeChange} />
      </section>
    );
  },

  phylocanvas: null,

  loadTree() {
    this.phylocanvas.load(this.props.newick, () => {
      this.styleTree();
      this.phylocanvas.fitInPanel();
      this.phylocanvas.draw();
      this.setState({
        treeLoaded: true,
      });
    });
  },

  styleTree() {
    this.setNodeLabels();
    this.props.styleTree(this.phylocanvas);
  },

  setNodeLabels() {
    for (const leaf of this.phylocanvas.leaves) {
      if (UploadedCollectionStore.contains(leaf.id)) {
        const assembly = UploadedCollectionStore.getAssemblies()[leaf.id];
        leaf.label = this.state.labelGetter(assembly);
      } else {
        const assembly = ReferenceCollectionStore.getAssemblies()[leaf.id];
        if (!assembly) {
          leaf.label = leaf.id;
          continue;
        }

        leaf.label = assembly.metadata.assemblyName;
        if (assembly.analysis) {
          leaf.label += `_${assembly.analysis.st}`;
        }
      }
    }
  },

  handleNodeSizeChange(event) {
    this.phylocanvas.setNodeSize(event.target.value);
  },

  handleLabelSizeChange(event) {
    this.phylocanvas.setTextSize(event.target.value);
  },

  handleTreeTypeChange(event) {
    this.phylocanvas.setTreeType(event.target.value);
  },

  handleFilteredDataStoreChange() {
    const newState = {};

    const labelGetter = FilteredDataStore.getLabelGetter();
    if (labelGetter !== this.state.labelGetter) {
      newState.labelGetter = labelGetter;
    }

    const colourTableColumn = FilteredDataStore.getColourTableColumnName();
    if (colourTableColumn !== this.state.colourTableColumn) {
      newState.colourTableColumn = colourTableColumn;
    }

    this.setState(newState);

    if (!FilteredDataStore.hasTextFilter()) {
      for (const leaf of this.phylocanvas.leaves) {
        leaf.highlighted = false;
      }
      return;
    }

    if (this.props.highlightFilteredNodes) {
      this.props.highlightFilteredNodes(this.phylocanvas);
    } else {
      const assemblyIds = FilteredDataStore.getAssemblyIds();
      for (const leaf of this.phylocanvas.leaves) {
        leaf.highlighted = (assemblyIds.indexOf(leaf.id) !== -1);
      }
    }
  },

});
