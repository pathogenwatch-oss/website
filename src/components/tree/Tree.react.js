import '../../css/tree.css';

import React from 'react';
import PhyloCanvas from 'PhyloCanvas';

import TreeControls from './TreeControls.react';
import TreeMenu from './TreeMenu.react';

import FilteredDataStore from '../../stores/FilteredDataStore';
import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';

import Species from '../../species';
import MetadataUtils from '../../utils/Metadata';
import DataUtils from '../../utils/Data';
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
    leafSelected: React.PropTypes.func,
  },

  getInitialState() {
    return ({
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      nodeSize: DEFAULT.NODE_SIZE,
      labelSize: DEFAULT.LABEL_SIZE,
      labelProperty: FilteredDataStore.getLabelTableColumnName(),
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

    phylocanvas.on('updated', this.props.leafSelected);
    phylocanvas.on('subtree', this.handleRedrawSubtree);
    phylocanvas.on('historytoggle', this.handleHistoryToggle);

    this.phylocanvas = phylocanvas;

    this.loadTree();
  },

  componentWillUpdate() {
    this.phylocanvas.canvasEl.removeEventListener('updated', this.props.leafSelected);
  },

  componentDidUpdate() {
    this.phylocanvas.resizeToContainer();

    this.phylocanvas.on('updated', this.props.leafSelected);

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
          <h2 className="wgsa-tree-heading">{title}</h2>
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
    const labelProperty = this.state.labelProperty;

    for (const leaf of this.phylocanvas.leaves) {
      if (UploadedCollectionStore.contains(leaf.id)) {
        const assembly = UploadedCollectionStore.getAssemblies()[leaf.id];
        let labelValue;
        if (labelProperty === 'Country') {
          labelValue = MetadataUtils.getCountry(assembly);
        } else if (labelProperty === 'Date') {
          labelValue = DataUtils.getFormattedDateString(assembly.metadata.date) || '';
        } else if (labelProperty === 'ST') {
          labelValue = assembly.analysis.st || '';
        } else {
          labelValue =
            assembly.metadata.assemblyName || assembly.metatdata.assemblyId;
        }
        leaf.label = labelValue;
      } else {
        leaf.label = `${leaf.id.replace(`${Species.id}_`, '')}`;
        const assembly = ReferenceCollectionStore.getAssemblies()[leaf.id];
        if (assembly && assembly.analysis) {
          leaf.label += `_${assembly.analysis.st}`;
        }
      }
    }

    this.phylocanvas.fitInPanel();
  },

  handleNodeSizeChange(event) {
    this.phylocanvas.setNodeSize(event.target.value);
  },

  handleLabelSizeChange(event) {
    this.phylocanvas.setTextSize(event.target.value);
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
    this.setState({
      labelProperty: FilteredDataStore.getLabelTableColumnName(),
    });
  },

});
