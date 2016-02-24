import React from 'react';

import DEFAULT from '^/defaults';

export default React.createClass({

  displayName: 'OverviewStatusItem',

  propTypes: {
    isReadyToUpload: React.PropTypes.bool,
  },

  render() {
    const { isReadyToUpload } = this.props;
    const iconStyle = {
      color: isReadyToUpload ?
        DEFAULT.CGPS.COLOURS.GREEN :
        DEFAULT.DANGER_COLOUR,
    };
    return (
      <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
        <div className="mdl-card__title mdl-card--expand">
          <i style={iconStyle} className="material-icons">
            { isReadyToUpload ? 'check_circle' : 'error' }
          </i>
        </div>
        <span className="mdl-card__actions mdl-card--border">
          { isReadyToUpload ? 'Ready To Upload' : 'Not Ready To Upload' }
        </span>
      </div>
    );
  },

});
