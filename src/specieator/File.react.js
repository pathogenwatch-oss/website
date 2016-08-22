import React from 'react';

import ProgressBar from '../components/ProgressBar.react';

import { taxIdMap } from '^/species';

export default React.createClass({

  propTypes: {
    name: React.PropTypes.string,
    progress: React.PropTypes.number,
    speciesId: React.PropTypes.string,
  },

  render() {
    const { name, progress, speciesId } = this.props;

    return (
      <article ref="component" className="mdl-cell mdl-cell--4-col wgsa-specieator-file">
        <h2 className="wgsa-specieator-file__title">{name}</h2>
        { speciesId ?
            <p>{taxIdMap.get(speciesId).formattedShortName}</p> :
            <ProgressBar progress={progress} />
        }
      </article>
    );
  },

});
