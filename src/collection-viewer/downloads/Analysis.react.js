import React from 'react';
import { connect } from 'react-redux';

import { getDownloadPrefix } from './selectors';
import { getActiveGenomeIds, getCollection } from '../selectors';

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
      className="mdl-button"
    >
      {children}
    </button>
    { genomeIds && <input type="hidden" name="ids" value={genomeIds} /> }
  </form>
);

const DownloadsMenu = ({ collection, genomeIds, prefix }) => (
  <li>
    <h4>Analysis</h4>
    <ul>
      <li>
        <DownloadForm
          link={`${prefix}/speciator`}
          filename={formatCollectionFilename(collection, 'speciator.csv')}
          genomeIds={genomeIds}
        >Speciation</DownloadForm>
      </li>
    </ul>
  </li>
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
