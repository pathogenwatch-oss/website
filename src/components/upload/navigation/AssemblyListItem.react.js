import '../../../css/upload-review.css';

import React from 'react';

import UploadWorkspaceNavigationActionCreators from '^/actions/UploadWorkspaceNavigationActionCreators';

import { DANGER_COLOUR, CGPS } from '^/defaults';

const Component = React.createClass({
  propTypes: {
    assemblyName: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      deleteConfirm: null,
    };
  },

  resetDeleteState() {
    this.setState({
      deleteConfirm: null
    });
  },

  handleDeleteConfirm(assemblyNameForDelete) {
    this.setState({
      deleteConfirm: assemblyNameForDelete
    });
  },

  handleSelectAssembly(selectedassemblyName) {
    this.resetDeleteState();
  },

  handleDeleteAssembly() {
    UploadWorkspaceNavigationActionCreators.deleteAssembly(this.props.assemblyName);
  },

  render() {
    const assemblyName = this.props.assemblyName;
    const validatedIconStyle = {
      color: this.props.isValid ? CGPS.COLOURS.GREEN : DANGER_COLOUR,
    };
    const validatedIcon = this.props.isValid ? 'check' : 'error_outline';

    return (
      <li ref={assemblyName} className={`assemblyListItem ${this.props.selected ? ' selected' : ''}`} title={assemblyName}>
        <a
          className="selectButton mdl-button mdl-js-button mdl-js-ripple-effect"
          href={`#assembly-${assemblyName}`}
          onClick={this.handleSelectAssembly.bind(this, assemblyName)}
        >
          <span className="filename">
            {assemblyName}
          </span>
        </a>
        { !this.props.isUploading && this.state.deleteConfirm ?
          <ConfirmDelete title={assemblyName} handleDeleteAssembly={this.handleDeleteAssembly} resetDeleteState={this.resetDeleteState}/>
          :
          <span className="assembly-list-item__utils">
            <span className="assembly-list-item__validate-icon utilityButton">
              <i style={validatedIconStyle} className="material-icons">{validatedIcon}</i>
            </span>
            <button className="deleteButton utilityButton mdl-button mdl-js-button mdl-button--icon mdl-button--colored"
              onClick={this.handleDeleteConfirm.bind(this, assemblyName)} disabled={this.props.isUploading}>
              <i className="material-icons">delete</i>
            </button>
          </span>
        }
      </li>
    );
  },

});

const ConfirmDelete = React.createClass({
  render() {
    return (
      <span className="assembly-list-item__utils">
        <button className="confirm-cancel-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"
          title="Cancel"
          onClick={this.props.resetDeleteState}>
          <i className="material-icons">clear</i>
        </button>
        <button className="wgsa-sonar-effect2 confirm-delete-button mdl-button mdl-js-button mdl-button--icon mdl-button--accent"
          title={'Confirm Delete - ' + this.props.title}
          onClick={this.props.handleDeleteAssembly}>
          <i className="material-icons">delete</i>
        </button>
      </span>
    );
  },
});

module.exports = Component;
