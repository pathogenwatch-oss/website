import React from 'react';

export default React.createClass({

  displayName: 'TreeMenu',

  propTypes: {
    tree: React.PropTypes.object,
    exportFilename: React.PropTypes.string,
    handleToggleNodeLabels: React.PropTypes.string,
    handleToggleNodeAlign: React.PropTypes.string,
    handleRedrawOriginalTree: React.PropTypes.string,
  },

  getInitialState() {
    return {
      active: false,
    };
  },

  render() {
    const { tree } = this.props;
    return (
      <div className="wgsa-tree-menu" ref="menu">
        <button id="tree-options" className="wgsa-tree-actions mdl-button mdl-js-button mdl-button--icon" onClick={this.handleClick}>
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="tree-options">
          <li className="mdl-menu__item" onClick={this.props.handleToggleNodeLabels}>Toggle Labels</li>
          <li className="mdl-menu__item" onClick={this.props.handleToggleNodeAlign}>Toggle Label Align</li>
          <li className="mdl-menu__item" onClick={this.props.handleRedrawOriginalTree}>Redraw Original Tree</li>
          <li className="mdl-menu__item">
            <a href={tree ? tree.getPngUrl() : '#'} download={`${this.props.exportFilename}`} target="_blank">
              Export Current View
            </a>
          </li>
        </ul>
      </div>
    );
  },

  handleClick() {
    this.setState({
      active: !this.state.active,
    });
  },

});
