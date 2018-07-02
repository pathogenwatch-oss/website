import './styles.css';

import React from 'react';
import Phylocanvas, { Tree } from 'phylocanvas';
import contextMenuPlugin from 'phylocanvas-plugin-context-menu';
import classnames from 'classnames';

import Spinner from '../../components/Spinner.react';

import Header from './Header.react';
import Controls from './Controls.react';
import History from './History.react';
import Scalebar from './Scalebar.react';
import { DEFAULT, CGPS } from '../../app/constants';

Phylocanvas.plugin(contextMenuPlugin);

Phylocanvas.plugin(decorate => {
  decorate(Tree, 'nodesUpdated', function (delegate, args) {
    const [ , flag, append ] = args;
    if (flag === this.clickFlag && typeof append === 'undefined') return;
    delegate.apply(this, args);
  });

  decorate(Tree, 'clicked', function (delegate, args) {
    const [ event ] = args;
    const node = this.getNodeAtMousePosition(event);

    if (event.shiftKey && node) {
      node.toggleCollapsed();
      this.draw();
      return;
    }

    const dragging = this.dragging;

    delegate.apply(this, args);

    if (dragging) return;

    this.nodesUpdated(
      this.getNodeIdsWithFlag(this.clickFlag),
      this.clickFlag,
      event.metaKey || event.ctrlKey
    );
  });
});

const fullWidthHeight = {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
};

export default React.createClass({

  displayName: 'Tree',

  propTypes: {
    newick: React.PropTypes.string,
    leafStyles: React.PropTypes.object,
    onLoaded: React.PropTypes.func,
    onUpdated: React.PropTypes.func,
    onTypeChanged: React.PropTypes.func,
    onInternalNodeSelected: React.PropTypes.func,
    loading: React.PropTypes.bool,
    filenames: React.PropTypes.object,
    resetTreeRoot: React.PropTypes.func,
  },

  getInitialState() {
    return {
      controlsVisible: false,
    };
  },

  componentDidMount() {
    const phylocanvas = Phylocanvas.createTree('phylocanvas-container', {
      contextMenu: {
        parent: document.body,
      },
      fillCanvas: true,
    });

    phylocanvas.padding = 64;
    phylocanvas.showLabels = true;
    phylocanvas.hoverLabel = true;
    phylocanvas.branchColour = DEFAULT.COLOUR;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.clickFlag = 'highlighted';
    phylocanvas.clickFlagPredicate = node => node.leaf;

    phylocanvas.on('loaded', () => {
      this.props.onLoaded(phylocanvas);
      if (this.props.root && this.props.root !== 'root') {
        this.changeRoot();
      }
    });
    phylocanvas.on('subtree', () => this.props.onSubtree(phylocanvas));
    phylocanvas.on('updated', event => this.props.onUpdated(event, phylocanvas));
    phylocanvas.on('typechanged', () => this.props.onTypeChanged(phylocanvas));
    phylocanvas._onInternalNodeSelected = event => {
      if (event.metaKey || event.ctrlKey) return;
      const node = phylocanvas.getNodeAtMousePosition(event);
      if (node && !node.leaf) this.props.onInternalNodeSelected(node);
    };
    phylocanvas.on('click', phylocanvas._onInternalNodeSelected);
    phylocanvas.on('error', error => console.error(error));

    this.phylocanvas = phylocanvas;
    this.phylocanvas.contextMenu.filenames = this.props.filenames;

    // must be native event to for body click cancellation to work
    this.refs.menuButton.addEventListener('click', e => this.toggleContextMenu(e));
    this.loadTree();
  },

  componentDidUpdate(previous) {
    this.phylocanvas.resizeToContainer();

    const { filenames, newick, root, type } = this.props;

    if (filenames !== previous.filenames) {
      this.phylocanvas.contextMenu.filenames = filenames;
    }

    if (newick !== previous.newick && newick !== this.phylocanvas.stringRepresentation) {
      this.loadTree();
      return;
    }

    if (root !== previous.root && root !== this.phylocanvas.root.id) {
      const drawn = this.changeRoot();
      if (drawn) return;
    }

    if (type && (type !== this.phylocanvas.treeType || !previous.loaded)) {
      this.phylocanvas.setTreeType(type);
    } else {
      this.phylocanvas.draw();
    }
  },

  componentWillUnmount() {
    try {
      this.phylocanvas.cleanup();
    } catch (e) {
      console.error(e);
    }
  },

  phylocanvas: null,

  loadTree() {
    this.phylocanvas.load(this.props.newick);
  },

  changeRoot() {
    if (this.props.root === 'root') {
      this.phylocanvas.redrawOriginalTree();
      return true;
    }
    const newRoot = this.phylocanvas.originalTree.branches[this.props.root];
    if (newRoot) {
      this.phylocanvas.redrawFromBranch(newRoot);
      return false;
    }
    this.phylocanvas.redrawOriginalTree();
    return true;
  },

  toggleContextMenu(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.phylocanvas.contextMenu.closed) {
      this.phylocanvas.contextMenu.close();
      return;
    }
    const { top, left } = $(event.target).offset();
    this.phylocanvas.contextMenu.open(left - 156, top + 32); // magic numbers to position the menu "bottom-right"
    this.phylocanvas.contextMenu.closed = false;
    this.phylocanvas.tooltip.close();
  },

  render() {
    const { Styler } = this.props;
    const { controlsVisible } = this.state;

    return (
      <section className="wgsa-tree">
        <div id="phylocanvas-container" style={fullWidthHeight}></div>
        <Styler phylocanvas={this.phylocanvas} />
        <Header />
        <button
          className={classnames(
            'mdl-button mdl-button--icon wgsa-tree-toggle-controls-button wgsa-pane-button wgsa-pane-overlay',
            { 'wgsa-pane-button--active': controlsVisible }
          )}
          title={controlsVisible ? 'Hide Tree Controls' : 'Show Tree Controls'}
          onClick={() => this.setState({ controlsVisible: !controlsVisible })}
        >
          <i className="material-icons">tune</i>
        </button>
        { this.props.root !== 'root' &&
          <button
            ref="redrawOriginalTreeButton"
            className="wgsa-pane-overlay wgsa-redraw-original-tree-button mdl-button mdl-button--icon"
            title="Redraw Original Tree"
            onClick={this.props.resetTreeRoot}
          >
            <i className="material-icons">replay</i>
          </button> }
        <button
          ref="menuButton"
          className="mdl-button mdl-js-button mdl-button--icon wgsa-tree-menu-button wgsa-pane-button wgsa-pane-overlay"
          title="More Options"
        >
          <i className="material-icons">more_vert</i>
        </button>
        <History stateKey={this.props.name} />
        <Scalebar phylocanvas={this.phylocanvas} />
        <Controls
          visible={controlsVisible}
          stateKey={this.props.name}
          phylocanvas={this.phylocanvas}
        />
        { this.props.loading ?
          <div className="wgsa-loading-overlay">
            <Spinner />
          </div> : null }
      </section>
    );
  },

});
