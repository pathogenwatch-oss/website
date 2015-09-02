import React from 'react';
import UploadStore from '../../../stores/UploadStore';
import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';
import AssemblyListItem from '../navigation/AssemblyListItem.react.js';
import { validateMetadata } from '../../../utils/Metadata.js';
import DEFAULT from '../../../defaults.js';
import '../../../css/upload-review.css';

const AssemblyList = React.createClass({

  getListOptionElements: function () {
    const fileAssemblyIds = UploadStore.getFileAssemblyIds();
    const assemblies = UploadStore.getAssemblies();
    const isValidMap = validateMetadata(assemblies);

    var style = {};
    return fileAssemblyIds.map((fileAssemblyId) => {
      return (
        <AssemblyListItem fileAssemblyId={fileAssemblyId} isValidMap={isValidMap} />
      );
    });
  },

  render: function () {
    const listOptionElements = this.getListOptionElements();
    return (
      <div>
        <ul className='assemblyListContainer'>
          {listOptionElements}
        </ul>
      </div>
    );
  }
});

module.exports = AssemblyList;
