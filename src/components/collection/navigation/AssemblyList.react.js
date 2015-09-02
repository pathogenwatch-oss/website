import React from 'react';

import AssemblyListItem from '../navigation/AssemblyListItem.react.js';

import UploadStore from '../../../stores/UploadStore';
import { validateMetadata } from '../../../utils/Metadata.js';

const AssemblyList = React.createClass({

  getListOptionElements: function () {
    const fileAssemblyIds = UploadStore.getFileAssemblyIds();
    const assemblies = UploadStore.getAssemblies();
    const isValidMap = validateMetadata(assemblies);

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
        <ul className="assemblyListContainer">
          {listOptionElements}
        </ul>
      </div>
    );
  },

});

module.exports = AssemblyList;
