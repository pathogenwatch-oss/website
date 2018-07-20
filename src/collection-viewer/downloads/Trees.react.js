import React from 'react';
import { connect } from 'react-redux';

import { getDownloadPrefix, getTreeName } from './selectors';
import { getActiveGenomeIds, getCollection } from '../selectors';

import { formatCollectionFilename } from './utils';
import { isSubtree } from '../tree/utils';
import { POPULATION } from '../../app/stateKeys/tree';

const DownloadForm = ({ link, filename, title, genomeIds, tree, children }) => (
  <form
    action={`${link}?filename=${filename}`}
    method="POST"
  >
    <button
      type="submit"
      download={filename}
      title={title}
      className="mdl-button"
      disabled={tree === POPULATION}
    >
      {children}
    </button>
    { genomeIds && <input type="hidden" name="ids" value={genomeIds} /> }
    { isSubtree(tree) && <input type="hidden" name="subtree" value={tree} /> }
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

const DownloadsMenu = ({ collection, genomeIds, prefix, tree }) => (
  <li>
    <h4>Trees</h4>
    <ul>
      <li>
        <DownloadForm
          link={`${prefix}/core-allele-distribution`}
          filename={formatCollectionFilename(collection, 'core-allele-distribution.csv')}
          genomeIds={genomeIds}
          tree={tree}
        >
          Core Allele Distribution
        </DownloadForm>
      </li>
      <li>
        <DownloadForm
          link={`${prefix}/score-matrix`}
          filename={formatCollectionFilename(collection, 'score-matrix.csv')}
          genomeIds={genomeIds}
          tree={tree}
        >
          Score Matrix
        </DownloadForm>
      </li>
      <li>
        <DownloadForm
          link={`${prefix}/difference-matrix`}
          filename={formatCollectionFilename(collection, 'difference-matrix.csv')}
          genomeIds={genomeIds}
          tree={tree}
        >
          Difference Matrix
        </DownloadForm>
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

DownloadsMenu.propTypes = {
  collection: React.PropTypes.object,
  genomeIds: React.PropTypes.array,
  prefix: React.PropTypes.string,
  tree: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
    genomeIds: getActiveGenomeIds(state),
    prefix: getDownloadPrefix(state),
    tree: getTreeName(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
