import '../../../css/upload-review.css';

import React from 'react';

import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';

import { DANGER_COLOUR, CGPS } from '../../../defaults';

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
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedassemblyName);
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
      <li ref={assemblyName} className={`assemblyListItem mdl-shadow--2dp${this.props.selected ? ' selected' : ''}`} title={assemblyName}>
        { this.state.deleteConfirm ?
          <ConfirmDelete title={assemblyName} handleDeleteAssembly={this.handleDeleteAssembly} resetDeleteState={this.resetDeleteState}/>
          :
          <div>
            <button className="selectButton mdl-button mdl-js-button mdl-js-ripple-effect" onClick={this.handleSelectAssembly.bind(this, assemblyName)}>
            <span className="filename">
                {assemblyName}
              </span>
            </button>
              { !this.props.isUploading &&
                <span className="assembly-list-item__utils">
                  <span className="assembly-list-item__validate-icon utilityButton">
                    <i style={validatedIconStyle} className="material-icons">{validatedIcon}</i>
                  </span>
                  <button className="deleteButton utilityButton mdl-button mdl-js-button mdl-button--icon mdl-button--colored"
                    onClick={this.handleDeleteConfirm.bind(this, assemblyName)}>
                    <i className="material-icons">delete</i>
                  </button>
                </span>
              }
          </div>
        }
      </li>
    );
  },

});

const ConfirmDelete = React.createClass({
  render() {
    return (
      <div>
        <button className="confirm-delete-button mdl-button mdl-js-button mdl-js-ripple-effect"
          title="Cancel"
          onClick={this.props.resetDeleteState}>
          <i className="material-icons">clear</i>
        </button>
        <button className="confirm-delete-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent"
          title={"Confirm Delete - " + this.props.title}
          onClick={this.props.handleDeleteAssembly}>
          <i className="material-icons">delete</i>
        </button>
      </div>
    );
  },
});

module.exports = Component;
