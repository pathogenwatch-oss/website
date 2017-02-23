import React from 'react';

import { DEFAULT } from '^/app/constants';

const iconStyle = {
  color: DEFAULT.WARNING_COLOUR,
};

const taskTypes = new Set([ 'PAARSNP', 'MLST' ]);

export default React.createClass({

  propTypes: {
    errors: React.PropTypes.array,
  },

  getMessage({ taskType, genomeName }) {
    if (taskType === 'PAARSNP') {
      return (
        <span>Antimicrobial resistance predictions will not be available for <strong>{genomeName}</strong></span>
      );
    }
    if (taskType === 'MLST') {
      return (
        <span>MLST prediction will not be available for <strong>{genomeName}</strong></span>
      );
    }

    return null;
  },

  render() {
    const errors = this.props.errors.filter(({ taskType }) => taskTypes.has(taskType));

    if (!errors.length) {
      return null;
    }

    return (
      <ul className="wgsa-upload-errors mdl-list">
        { errors.map((error, index) => (
            <li key={index} className="mdl-list__item">
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
