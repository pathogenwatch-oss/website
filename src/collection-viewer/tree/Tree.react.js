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
      collapsedColour: '#222',
      fillCanvas: true,
    });

    phylocanvas.setTreeType('rectangular');

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
    phylocanvas.on('error', error => console.error(error));

    this.phylocanvas = phylocanvas;

    // must be native event to for body click cancellation to work
    this.refs.menuButton.addEventListener('click', e => this.toggleContextMenu(e));
    // must be native event for timing to work :/
    this.refs.redrawOriginalTreeButton.addEventListener('click', () => phylocanvas.redrawOriginalTree());

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
      this.changeRoot();
    }

    if (type && (type !== this.phylocanvas.treeType || !previous.loaded)) {
      this.phylocanvas.setTreeType(type);
    } else {
      this.phylocanvas.draw();
    }
  },

  componentWillUnmount() {
    this.phylocanvas.cleanup();
  },

  phylocanvas: null,

  loadTree() {
    this.phylocanvas.load(this.props.newick);
  },

  changeRoot() {
    const newRoot = this.phylocanvas.originalTree.branches[this.props.root];
    if (newRoot) {
      this.phylocanvas.redrawFromBranch(newRoot);
    } else {
      this.phylocanvas.redrawOriginalTree();
    }
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
        <button
          ref="redrawOriginalTreeButton"
          className={classnames(
            'wgsa-pane-overlay wgsa-redraw-original-tree-button mdl-button mdl-button--icon',
            { 'wgsa-redraw-original-tree-button--visible': this.props.root !== 'root' }
          )}
          title="Redraw Original Tree"
        >
          <i className="material-icons">replay</i>
        </button>
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
