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
      // console.log(currentAssemblyIdOnDisplay, nextAssemblyIdForDisplay);
      this.setState({
        selectedOption: nextAssemblyIdForDisplay
      })
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

// console.log(isValidMap)
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
// console.log(fileAssemblyId, isValidMap[fileAssemblyId], validatedIcon, validatedIconStyle)
      return (
        <div style={style} className='assemblyListItem' key={fileAssemblyId}>
          <a className='mdl-button mdl-js-button mdl-js-ripple-effect'
            onClick={this.handleSelectAssembly.bind(this, fileAssemblyId)}
            >
            {fileAssemblyId}
          </a>

          <div className="utilityButton mdl-button mdl-js-button mdl-button--icon" disabled>
            <i style={validatedIconStyle} className='material-icons'>{validatedIcon}</i>
          </div>

          <button className="deleteButton utilityButton mdl-button mdl-js-button mdl-button--icon mdl-button--colored"
            onClick={this.handleDeleteAssembly.bind(this, fileAssemblyId)}>
            <i className="material-icons">delete</i>
          </button>
        </div>
      );
    });
  },

  handleSelectAssembly: function (selectedFileAssemblyId) {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
  },

  render: function () {
    const listOptionElements = this.getListOptionElements();
    return (
      <div className='assemblyListContainer'>
        {listOptionElements}
      </div>
    );
  }
});

module.exports = AssemblyList;
