import React from 'react';
import { connect } from 'react-redux';

import { getDownloadPath } from './selectors';
import { getCollection } from '../selectors';
import { getActiveGenomeIds } from '../selectors/active';

import { formatCollectionFilename } from './utils';

import Organisms from '~/organisms';

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
  <React.Fragment>
    <DownloadForm
      link={`${prefix}/speciator`}
      filename={formatCollectionFilename(collection, 'species-prediction.csv')}
      genomeIds={genomeIds}
    >
      Species prediction
    </DownloadForm>
    { Organisms.uiOptions.kleborate &&
    <DownloadForm
      link={`${prefix}/kleborate`}
      filename={formatCollectionFilename(collection, 'kleborate.csv')}
      genomeIds={genomeIds}
    >
      Kleborate
    </DownloadForm> }
    { Organisms.uiOptions['sarscov2-variants'] &&
    <DownloadForm
      link={`${prefix}/sarscov2Variants`}
      filename={formatCollectionFilename(collection, 'sarscov2Variants.csv')}
      genomeIds={genomeIds}
    >
      Notable Variants
    </DownloadForm> }
    { Organisms.uiOptions.vista &&
    <DownloadForm
      link={`${prefix}/vista`}
      filename={formatCollectionFilename(collection, 'vista.csv')}
      genomeIds={genomeIds}
    >
      Virulence
    </DownloadForm> }

  </React.Fragment>
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
    prefix: getDownloadPath(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
