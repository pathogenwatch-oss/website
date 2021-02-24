import React from 'react';
import { connect } from 'react-redux';

import { getDownloadPath } from './selectors';
import { getCollection } from '../selectors';
import { getActiveGenomeIds } from '../selectors/active';

import { formatCollectionFilename } from './utils';

import Organisms from '~/organisms';
import { getGenomeDatatypes } from '~/collection-viewer/genomes/selectors';

const DownloadForm = ({ link, filename, title, genomeIds, children }) => (
  <form
    action={`${link}?filename=${filename}`}
    method="POST"
  >
    <button
      type="submit"
      download={filename}
      title={title}
    >
      {children}
    </button>
    { genomeIds && <input type="hidden" name="ids" value={genomeIds} /> }
  </form>
);

const DownloadsMenu = ({ collection, genomeIds, prefix, datatypes: { hasKleborateAMR } }) => (
  <React.Fragment>
    <DownloadForm
      link={`${prefix}/speciator`}
      filename={formatCollectionFilename(collection, 'species-prediction.csv')}
      genomeIds={genomeIds}
    >
      Species prediction
    </DownloadForm>
    { hasKleborateAMR &&
    <DownloadForm
      link={`${prefix}/kleborate`}
      filename={formatCollectionFilename(collection, 'kleborate.csv')}
      genomeIds={genomeIds}
    >
      Full Kleborate
    </DownloadForm> }
  </React.Fragment>
);

DownloadsMenu.propTypes = {
  collection: React.PropTypes.object,
  datatypes: React.PropTypes.object,
  genomeIds: React.PropTypes.array,
  prefix: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
    datatypes: getGenomeDatatypes(state),
    genomeIds: getActiveGenomeIds(state),
    prefix: getDownloadPath(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
