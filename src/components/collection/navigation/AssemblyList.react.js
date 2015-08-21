import React from 'react';
import UploadStore from '../../../stores/UploadStore';
import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';
import { validateMetadata } from '../../../utils/Metadata.js';

import '../../../css/UploadReview.css';

const AssemblyList = React.createClass({

  getInitialState: function () {
    return {
      selectedOption: null,
      validated_icon: 'remove',
      validated_icon_color: {color: '#888'}
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

  handleDeleteAssembly: function(fileAssemblyId) {
    console.log('a')
    UploadWorkspaceNavigationActionCreators.deleteAssembly(fileAssemblyId);
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
    const isValid = validateMetadata(assemblies);

    return fileAssemblyIds.map((fileAssemblyId) => {
      return (
        <div className='assemblyListItem' key={fileAssemblyId}>
          <a className='mdl-button mdl-js-button mdl-js-ripple-effect'
            onClick={this.handleSelectAssembly.bind(this, fileAssemblyId)}
            key={fileAssemblyId}
            >
            {fileAssemblyId}
          </a>

          <button className="utilityButton mdl-button mdl-js-button mdl-button--icon" disabled>
            <i style={this.state.validated_icon_color} className='material-icons'>{this.state.validated_icon}</i>
          </button>

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
