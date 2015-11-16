import React from 'react';

import GoogleMap from './GoogleMap.react';

import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators.js';

import MapUtils from '../../utils/Map';

function createInfoWindow(assemblies) {
  const container = document.createElement('div');

  for (const { fasta } of assemblies) {
    const { name } = fasta;
    const button = document.createElement('button');
    const textNode = document.createTextNode(name);
    button.appendChild(textNode);
    button.className = 'wgsa-info-window-button mdl-button mdl-js-button mdl-js-ripple-effect';
    button.onclick = UploadWorkspaceNavigationActionCreators.navigateToAssembly.bind(null, name);
    componentHandler.upgradeElement(button);
    container.appendChild(button);
  }

  return container;
}

export default React.createClass({

  displayName: 'UploadOverviewMap',

  propTypes: {
    assemblies: React.PropTypes.array,
  },

  render() {
    const { assemblies } = this.props;
    const markerDefs = MapUtils.getMarkerDefinitions(
      Object.keys(assemblies).map(key => assemblies[key]),
      { createInfoWindow }
    );

    return (
      <fieldset className="metadata-field__map">
        <GoogleMap markerDefs={markerDefs} />
      </fieldset>
    );
  },

});
