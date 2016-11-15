import './styles.css';

import React from 'react';
import Phylocanvas, { Tree } from 'phylocanvas';
import contextMenuPlugin from 'phylocanvas-plugin-context-menu';

import Header from './Header.react';
import Controls from './Controls.react';
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

  let count = 0;
  decorate(Tree, 'draw', function (delegate, args) {
    console.log('drawn', count++);
    delegate.apply(this, args);
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

    // phylocanvas.on('subtree', () => {
    //   this.props.setUnfilteredIds(phylocanvas.leaves.map(_ => _.id));
    //   this.setBaseSize(phylocanvas);
    // });

    phylocanvas.on('loaded', this.onLoaded);
    phylocanvas.on('updated', this.onUpdated);

    this.phylocanvas = phylocanvas;

    // must be native event to for body click cancellation to work
    this.refs.menuButton.addEventListener('click', (e) => this.toggleContextMenu(e));

    this.loadTree();
  },

  componentDidUpdate(previous) {
    this.phylocanvas.resizeToContainer();

    const { filenames, newick } = this.props;

    if (filenames !== previous.filenames) {
      this.phylocanvas.contextMenu.filenames = filenames;
    }

    if (newick && newick !== this.phylocanvas.stringRepresentation) {
      this.loadTree();
    }
  },

  onLoaded() {
    this.props.onLoaded(this.phylocanvas);
  },

  onUpdated(event) {
    this.props.onUpdated(event, this.phylocanvas);
  },

  phylocanvas: null,

  loadTree() {
    this.phylocanvas.load(this.props.newick);
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
    return (
      <section className="wgsa-tree">
        <Header />
        <div id="phylocanvas-container" style={fullWidthHeight}></div>
        <Styler phylocanvas={this.phylocanvas} />
        <button
          ref="menuButton"
          className="mdl-button mdl-js-button mdl-button--icon wgsa-tree-menu-button"
        >
          <i className="material-icons">more_vert</i>
        </button>
        <Controls
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
