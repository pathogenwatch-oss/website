import React from 'react';

import GoogleMap from '../GoogleMap.react';

import { navigateToAssembly } from '^/utils/Navigation';

import MapUtils from '^/utils/Map';

function createInfoWindow(assemblies) {
  const container = document.createElement('div');

  for (const { name } of assemblies) {
    const button = document.createElement('button');
    const textNode = document.createTextNode(name);
    button.appendChild(textNode);
    button.className =
      'wgsa-info-window-button mdl-button mdl-js-button mdl-js-ripple-effect';
    button.onclick = () => { navigateToAssembly(name); };
    componentHandler.upgradeElement(button);
    container.appendChild(button);
  }

  return container;
}

export default React.createClass({

  displayName: 'UploadOverviewMap',

  propTypes: {
    assemblies: React.PropTypes.object,
  },

  render() {
    const { assemblies } = this.props;
    const markerDefs = MapUtils.getMarkerDefinitions(
      Object.keys(assemblies).map(key => assemblies[key]),
      createInfoWindow
    );

    return (
      <fieldset className="metadata-field__map">
        <GoogleMap markerDefs={markerDefs} resetMarkers />
      </fieldset>
    );
  },

});
