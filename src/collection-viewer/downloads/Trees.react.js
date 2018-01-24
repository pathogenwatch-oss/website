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

const DownloadButton = ({ link, filename, title, children }) => (
  <a
    href={`${link}?filename=${filename}`}
    target="_blank" rel="noopener"
    download={filename}
    title={title}
    className="mdl-button"
  >
    {children}
  </a>
);

const DownloadsMenu = ({ collection, genomeIds, prefix }) => (
  <li>
    <h4>Trees</h4>
    <ul>
      <li>
        <DownloadForm
          link={`${prefix}/core-allele-distribution`}
          filename={formatCollectionFilename(collection, 'core-allele-distribution.csv')}
          genomeIds={genomeIds}
        >Core Allele Distribution</DownloadForm>
      </li>
      <li>
        <DownloadForm
          link={`${prefix}/score-matrix`}
          filename={formatCollectionFilename(collection, 'score-matrix.csv')}
          genomeIds={genomeIds}
        >Score Matrix</DownloadForm>
      </li>
      <li>
        <DownloadForm
          link={`${prefix}/difference-matrix`}
          filename={formatCollectionFilename(collection, 'difference-matrix.csv')}
          genomeIds={genomeIds}
        >Difference Matrix</DownloadForm>
      </li>
      <li>
        <DownloadButton
          link={`${prefix}/variance-summary`}
          filename={formatCollectionFilename(collection, 'variance-summary.csv')}
        >
          Variance Summary
        </DownloadButton>
      </li>
    </ul>
  </li>
);

DownloadsMenu.PropTypes = {
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
