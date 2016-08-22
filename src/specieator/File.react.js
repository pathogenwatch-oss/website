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

    let speciesName;
    if (speciesId) {
      const species = taxIdMap.get(speciesId);
      speciesName =
        species ?
          (<p>{species.formattedShortName}</p>) :
          (<a target="_blank" rel="noopener" href={`http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${speciesId}`}>{speciesId}</a>);
    }

    return (
      <article ref="component" className="mdl-cell wgsa-specieator-file">
        <h2 className="wgsa-specieator-file__title">{name}</h2>
        { speciesName || <ProgressBar progress={progress} /> }
      </article>
    );
  },

});
