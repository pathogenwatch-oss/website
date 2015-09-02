import React from 'react';
import css from '../../../css/upload-review.css';

import { ListItem, FontIcon } from 'material-ui';
import createThemeManager from 'material-ui/lib/styles/theme-manager';
import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';

const ThemeManager = createThemeManager();

const Component = React.createClass({
  propTypes: {
    fileAssemblyId: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      selectedOption: null,
      deleteConfirm: null
    };
  },

  componentDidMount: function () {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  componentWillUnmount: function () {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  resetDeleteState: function() {
    this.setState({
      deleteConfirm: null
    });
  },

  handleUploadWorkspaceNavigationStoreChange: function () {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getFileAssemblyId()
    });
  },

  handleDeleteConfirm: function(fileAssemblyIdForDelete) {
    this.setState({
      deleteConfirm: null
    });
    this.setState({
      deleteConfirm: fileAssemblyIdForDelete
    });
  },

  handleSelectAssembly: function (selectedFileAssemblyId) {
    this.resetDeleteState();
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
  },

  render: function () {
    const fileAssemblyId = this.props.fileAssemblyId;
    const isValidMap = this.props.isValidMap;
    var validatedIconStyle = {
      color: '#888'
    };
    var validatedIcon = {
      icon: 'remove'
    };

    if (isValidMap) {
      if(isValidMap[fileAssemblyId]) {
        validatedIconStyle = { color: 'green' };
        validatedIcon = 'check';
      }
      else {
        validatedIconStyle = { color: 'red' };
        validatedIcon = 'error_outline';
      }
    }

    if (this.state.deleteConfirm) {
      return (
        <ConfirmDelete fileAssemblyId={this.state.deleteConfirm} resetDeleteState={this.resetDeleteState}/>
      );
    }
    else {
      return (
        <li key={fileAssemblyId} ref={fileAssemblyId} className={`assemblyListItem mdl-shadow--2dp${this.state.selectedOption === fileAssemblyId ? ' selected' : ''}`} title={fileAssemblyId}>
          <button className='selectButton mdl-button mdl-js-button mdl-js-ripple-effect' onClick={this.handleSelectAssembly.bind(this, fileAssemblyId)}>
            <span className='filename'>
              {fileAssemblyId}
            </span>
          </button>
          <span className="assembly-list-item__utils">
            <span className="assembly-list-item__validate-icon utilityButton">
              <i style={validatedIconStyle} className='material-icons'>{validatedIcon}</i>
            </span>
            <button className="deleteButton utilityButton mdl-button mdl-js-button mdl-button--icon mdl-button--colored"
              onClick={this.handleDeleteConfirm.bind(this, fileAssemblyId)}>
              <i className="material-icons">delete</i>
            </button>
          </span>
        </li>
      );
    }
  }
});

var ConfirmDelete = React.createClass({

  handleDeleteAssembly: function(fileAssemblyIdForDelete) {
    const currentAssemblyIdOnDisplay = UploadWorkspaceNavigationStore.getFileAssemblyId();

    if (currentAssemblyIdOnDisplay === fileAssemblyIdForDelete) {
      var nextAssemblyIdForDisplay = UploadWorkspaceNavigationStore.getNextFileAssemblyIdOnDelete(fileAssemblyIdForDelete);
      console.log('Deleting file and navigate to', nextAssemblyIdForDisplay)
      UploadWorkspaceNavigationActionCreators.navigateToAssembly(nextAssemblyIdForDisplay);
    }
    else {
      console.log('Deleting file silently', fileAssemblyIdForDelete)
    }

    UploadWorkspaceNavigationActionCreators.deleteAssembly(fileAssemblyIdForDelete);
    this.props.resetDeleteState();
  },

  render() {
    return (
      <div>
        <button className="confirm-delete-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent"
          title="Delete"
          onClick={this.handleDeleteAssembly.bind(this, this.props.fileAssemblyId)}>
          <i className="material-icons">delete</i>
        </button>
        <button className="confirm-delete-button mdl-button mdl-js-button mdl-js-ripple-effect"
          title="Cancel"
          onClick={this.props.resetDeleteState}>
          <i className="material-icons">clear</i>
        </button>
      </div>
    );
  }
})

module.exports = Component;
