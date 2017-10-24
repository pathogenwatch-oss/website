import React from 'react';

export default createClass({

  displayName: 'LeafletIconMarker',

  render() {
    const { marker, style, onClick } = this.props;
    return (
      <div style={style} className="leaflet-marker-icon material-icons" onClick={onClick}>
        { marker.icon || 'place' }
      </div>
    );
  },

});
