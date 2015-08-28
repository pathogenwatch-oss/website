import React from 'react';
import UploadStore from '../../../stores/UploadStore';
import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';
import { validateMetadata } from '../../../utils/Metadata.js';
import DEFAULT from '../../../defaults.js';
import '../../../css/UploadReview.css';

const AssemblyList = React.createClass({

  getInitialState: function () {
    return {
      selectedOption: null
    };
  },

  componentDidMount: function () {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  componentWillUnmount: function () {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  handleUploadWorkspaceNavigationStoreChange: function () {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getFileAssemblyId()
    });
  },

  handleDeleteConfirm: function() {
    return <ConfirmDelete />;
  },

  handleDeleteAssembly: function(fileAssemblyIdForDelete) {
    const currentAssemblyIdOnDisplay = UploadWorkspaceNavigationStore.getFileAssemblyId();
    const allAssemblyIds = UploadStore.getFileAssemblyIds();
    const indexOfFileAssemblyIdForDelete = allAssemblyIds.indexOf(fileAssemblyIdForDelete);
    const totalNoAssemblyIds = allAssemblyIds.length;
    var nextAssemblyIdForDisplay = null;
    // Check next index is a valid fileId for traverse
    if (allAssemblyIds.length > 0) {
      if (indexOfFileAssemblyIdForDelete + 1 < totalNoAssemblyIds) {
        nextAssemblyIdForDisplay = allAssemblyIds[indexOfFileAssemblyIdForDelete + 1];
      }
      else {
        nextAssemblyIdForDisplay = allAssemblyIds[indexOfFileAssemblyIdForDelete - 1];
      }
    }

    if (currentAssemblyIdOnDisplay === fileAssemblyIdForDelete) {
      console.log('Deleting file and navigate to', nextAssemblyIdForDisplay)
      UploadWorkspaceNavigationActionCreators.navigateToAssembly(nextAssemblyIdForDisplay);
    }
    else {
      console.log('Deleting file silently', fileAssemblyIdForDelete)
    }

    UploadWorkspaceNavigationActionCreators.deleteAssembly(fileAssemblyIdForDelete);
  },

  toggleUtilityButtons: function(event) {
    const listElement = event.target.getElementsByClassName('utilityButton')[0];
    if (listElement.style.display === 'block') {
      listElement.style.display = 'none';
    }
    else {
      listElement.style.display = 'block';
    }
  },

  getListOptionElements: function () {
    const fileAssemblyIds = UploadStore.getFileAssemblyIds();
    const assemblies = UploadStore.getAssemblies();
    const isValidMap = validateMetadata(assemblies);
    var validatedIconStyle = {
      color: '#888'
    };
    var validatedIcon = {
      icon: 'remove'
    };

    var style = {};
    return fileAssemblyIds.map((fileAssemblyId) => {

      if (this.state.selectedOption == fileAssemblyId) {
        style = {
          'backgroundColor': DEFAULT.CGPS.COLOURS.GREY
        }
      }
      else {
        style = {};
      }

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

      return (
        <li className={`assemblyListItem mdl-shadow--2dp${this.state.selectedOption === fileAssemblyId ? ' selected' : ''}`}>
          <button className='selectButton mdl-button mdl-js-button mdl-js-ripple-effect' key={fileAssemblyId} onClick={this.handleSelectAssembly.bind(this, fileAssemblyId)}>
            <span className='filename'>
              {fileAssemblyId}
            </span>
          </button>
          <button className="validateButton utilityButton mdl-button mdl-js-button mdl-button--icon" disabled>
            <i style={validatedIconStyle} className='material-icons'>{validatedIcon}</i>
          </button>
          <button className="deleteButton utilityButton mdl-button mdl-js-button mdl-button--icon mdl-button--colored"
            onClick={this.handleDeleteAssembly.bind(this, fileAssemblyId)}>
            <i className="material-icons">delete</i>
          </button>
        </li>
      );
    });
  },

  handleSelectAssembly: function (selectedFileAssemblyId) {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
  },

  render: function () {
    const listOptionElements = this.getListOptionElements();
    return (
      <ul className='assemblyListContainer'>
        {listOptionElements}
      </ul>
    );
  }
});


var ConfirmDelete = React.createClass({

  render() {
    return (
      <button className='confirm-delete-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'
        >
        Confirm Delete?
      </button>
    );
  }
})


module.exports = AssemblyList;
