import '../../css/tree.css';

import React from 'react';
import PhyloCanvas from 'PhyloCanvas';

import TreeControls from './TreeControls.react';
import TreeMenu from './TreeMenu.react';

import FilteredDataStore from '../../stores/FilteredDataStore';
import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';

import DEFAULT, { CGPS } from '../../defaults';

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

    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container');

    phylocanvas.padding = 128;
    phylocanvas.showLabels = true;
    phylocanvas.hoverLabel = true;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.setTreeType(this.state.treeType);
    phylocanvas.setNodeSize(this.state.nodeSize);
    phylocanvas.setTextSize(this.state.labelSize);

    phylocanvas.on('subtree', this.handleRedrawSubtree);
    phylocanvas.on('historytoggle', this.handleHistoryToggle);

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
          <TreeMenu
            tree={this.phylocanvas}
            exportFilename={`${title}.png`}
            handleToggleNodeLabels={this.handleToggleNodeLabels}
            handleToggleNodeAlign={this.handleToggleNodeAlign}
            handleRedrawOriginalTree={this.handleRedrawOriginalTree} />
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
      this.setState({
        treeLoaded: true,
      });
    });
  },

  styleTree() {
    this.setNodeLabels();
    this.props.styleTree(this.phylocanvas);
    this.phylocanvas.draw();
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

  handleToggleNodeLabels() {
    this.phylocanvas.toggleLabels();
  },

  handleRedrawOriginalTree() {
    this.phylocanvas.redrawOriginalTree();
    this.styleTree(this.phylocanvas);
    this.phylocanvas.draw();
  },

  handleToggleNodeAlign() {
    this.phylocanvas.alignLabels = !this.phylocanvas.alignLabels;
    this.phylocanvas.draw();
  },

  handleFilteredDataStoreChange() {
    const newState = {};
    const labelGetter = FilteredDataStore.getLabelGetter();
    const colourTableColumn = FilteredDataStore.getColourTableColumnName();

    if (labelGetter !== this.state.labelGetter) {
      newState.labelGetter = labelGetter;
    }

    if (colourTableColumn !== this.state.colourTableColumn) {
      newState.colourTableColumn = colourTableColumn;
    }

    this.setState(newState);
  },

});
