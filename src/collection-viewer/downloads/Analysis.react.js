import React from 'react';
import { connect } from 'react-redux';

import { getDownloadPrefix } from './selectors';
import { getCollection } from '../selectors';
import { getActiveGenomeIds } from '../selectors/active';

import { formatCollectionFilename } from './utils';

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

const DownloadsMenu = ({ collection, genomeIds, prefix }) => (
  <DownloadForm
    link={`${prefix}/speciator`}
    filename={formatCollectionFilename(collection, 'species-prediction.csv')}
    genomeIds={genomeIds}
  >Species prediction</DownloadForm>
);

DownloadsMenu.propTypes = {
  collection: React.PropTypes.object,
  genomeIds: React.PropTypes.array,
  prefix: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
    genomeIds: getActiveGenomeIds(state),
    prefix: getDownloadPrefix(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
