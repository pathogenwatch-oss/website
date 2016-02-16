import React from 'react';

import { WARNING_COLOUR } from '^/defaults';

const iconStyle = {
  color: WARNING_COLOUR,
};

const statuses = [ 'PAARSNP', 'MLST' ];

export default React.createClass({

  propTypes: {
    errors: React.PropTypes.array,
  },

  getMessage({ taskType, assemblyName }) {
    if (taskType === 'PAARSNP') {
      return (
        <span>Antimicrobial resistance predictions will not be available for <strong>{assemblyName}</strong></span>
      );
    }
    if (taskType === 'MLST') {
      return (
        <span>MLST prediction will not be available for <strong>{assemblyName}</strong></span>
      );
    }
  },

  render() {
    const { errors } = this.props;
    return (
      <ul className="wgsa-upload-errors mdl-list">
        { errors.
            filter(({ taskType }) => statuses.indexOf(taskType) !== -1).
            map((error) => (
              <li className="mdl-list__item">
                <span className="mdl-list__item-primary-content">
                  <i className="material-icons mdl-list__item-icon" style={iconStyle}>warning</i>
                  { this.getMessage(error) }
                </span>
              </li>
            ))
        }
      </ul>
    );
  },

});
