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

  getMessage({ taskType, name }) {
    if (taskType === 'PAARSNP') {
      return (
        <span>AMR predictions could not be determined for <strong>{name}</strong></span>
      );
    }
    if (taskType === 'MLST') {
      return (
        <span>MLST prediction could not be determined for <strong>{name}</strong></span>
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
      <ul>
        { errors.map((error, index) => (
            <li key={index} className="wgsa-upload-warning">
              <i className="material-icons" style={iconStyle}>warning</i>
              { this.getMessage(error) }
            </li>
          ))
        }
      </ul>
    );
  },

});
