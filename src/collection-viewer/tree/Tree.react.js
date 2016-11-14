import './styles.css';

import React from 'react';
import Phylocanvas, { Tree } from 'phylocanvas';
import contextMenuPlugin from 'phylocanvas-plugin-context-menu';
import classnames from 'classnames';

import TreeHeader from './Header.react';
import TreeHistory from './History.react';
import TreeControls from './Controls.react';
import Spinner from '../../components/Spinner.react';

import { DEFAULT, CGPS } from '../../app/constants';

Phylocanvas.plugin(contextMenuPlugin);

Phylocanvas.plugin(decorate => {
  decorate(Tree, 'clicked', function (delegate, args) {
    const [ event ] = args;
    const node = this.getNodeAtMousePosition(event);
    if (event.shiftKey && node) {
      node.toggleCollapsed();
      this.draw();
    } else {
      delegate.apply(this, args);
    }
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
    loading: React.PropTypes.bool,
    filenames: React.PropTypes.object,
    setUnfilteredIds: React.PropTypes.func,
    setBaseSize: React.PropTypes.func,
  },

  componentDidMount() {
    const phylocanvas = Phylocanvas.createTree('phylocanvas-container', {
      contextMenu: {
        parent: document.body,
      },
      // collapsedColour: '#222',
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
        this.loadSubtree();
      }
    });
    phylocanvas.on('subtree', () => this.props.onSubtree(phylocanvas));
    phylocanvas.on('updated', event => this.props.onUpdated(event, phylocanvas));

    this.phylocanvas = phylocanvas;

    // must be native event to for body click cancellation to work
    this.refs.menuButton.addEventListener('click', e => this.toggleContextMenu(e));
    // must be native event for timing to work :/
    this.refs.redrawOriginalTreeButton.addEventListener('click', () => phylocanvas.redrawOriginalTree());

    this.loadTree();
  },

  componentDidUpdate(previous) {
    this.phylocanvas.resizeToContainer();

    const { filenames, newick, leafProps, root } = this.props;

    if (filenames !== previous.filenames) {
      this.phylocanvas.contextMenu.filenames = filenames;
    }

    if (newick !== previous.newick && newick !== this.phylocanvas.stringRepresentation) {
      this.loadTree();
      return;
    }

    if (root !== previous.root && root !== this.phylocanvas.root.id) {
      this.loadSubtree();
      return;
    }

    if (leafProps !== previous.leafProps) {
      this.applyLeafProps();
    }
  },

  phylocanvas: null,

  loadTree() {
    this.phylocanvas.load(this.props.newick);
  },

  loadSubtree() {
    const newRoot = this.phylocanvas.originalTree.branches[this.props.root];
    if (newRoot) {
      this.phylocanvas.redrawFromBranch(newRoot);
    } else {
      this.phylocanvas.redrawOriginalTree();
    }
  },

  applyLeafProps() {
    if (!this.props.loaded) return;

    for (const leaf of this.phylocanvas.leaves) {
      const { interactive = true, ...props } = this.props.leafProps[leaf.id];
      leaf.setDisplay({
        ...props.display,
        leafStyle: {
          strokeStyle: DEFAULT.COLOUR,
          fillStyle: props.colour,
          lineWidth: 1,
        },
      });
      leaf.label = props.label;
      leaf.highlighted = props.highlighted;
      leaf.interactive = interactive;
    }
    this.phylocanvas.draw();
  },

  toggleContextMenu(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.phylocanvas.contextMenu.closed) {
      this.phylocanvas.contextMenu.close();
      return;
    }
    const { top, left } = $(event.target).offset();
    this.phylocanvas.contextMenu.open(left - 128, top + 32); // magic numbers to position the menu "bottom-right"
    this.phylocanvas.contextMenu.closed = false;
    this.phylocanvas.tooltip.close();
  },

  render() {
    return (
      <section className="wgsa-tree">
        <TreeHeader />
        <div id="phylocanvas-container" style={fullWidthHeight}></div>
        <button
          ref="menuButton"
          className="mdl-button mdl-js-button mdl-button--icon wgsa-tree-menu-button wgsa-tree-overlay"
        >
          <i className="material-icons">more_vert</i>
        </button>
        <button
          ref="redrawOriginalTreeButton"
          className={classnames(
            'wgsa-tree-overlay wgsa-redraw-original-tree-button mdl-button',
            { 'wgsa-redraw-original-tree-button--visible': this.props.root !== 'root' }
          )}
        >
          Redraw Original Tree
        </button>
        <TreeHistory stateKey={this.props.name} />
        <TreeControls
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
