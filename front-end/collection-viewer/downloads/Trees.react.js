import React from 'react';
import { connect } from 'react-redux';
import { exportFile } from '@cgps/libmicroreact/utils/downloads';

import { getDownloadPath } from './selectors';
import { getCollection } from '../selectors';
import { getActiveGenomeIds } from '../selectors/active';
import { getTreeStateKey } from '../tree/selectors';
import { hasCore } from '~/collection-viewer/genomes/selectors';

import { formatCollectionFilename } from './utils';
import { topLevelTrees } from '../tree/constants';

import { POPULATION } from '../../app/stateKeys/tree';
import { getFilenamePrefix } from '../tree/selectors/phylocanvas';

const DownloadForm = ({ link, filename, title, genomeIds, tree, children }) => (
  <form
    action={`${link}?filename=${filename}`}
    method="POST"
  >
    <button
      type="submit"
      download={filename}
      title={title}
      disabled={tree === POPULATION}
    >
      {children}
    </button>
    {genomeIds && <input type="hidden" name="ids" value={genomeIds} />}
    {!topLevelTrees.has(tree) && <input type="hidden" name="subtree" value={tree} />}
  </form>
);

const DownloadButton = ({ link, filename, title, children }) => (
  <a
    href={`${link}?filename=${filename}`}
    target="_blank" rel="noopener"
    download={filename}
    title={title}
  >
    {children}
  </a>
);

const DownloadsMenu = ({ collection, genomeIds, path, filename, tree, core }) => (
  <React.Fragment>
    {tree ?
      <React.Fragment>
      <button onClick={() => exportFile('tree-nwk', filename)}>
        Tree (.nwk)
      </button>
      <button onClick={() => exportFile('tree-png', filename)}>
        Tree (.png)
      </button>
      <button onClick={() => exportFile('tree-svg', filename)}>
      Tree (.svg)
      </button>
      </React.Fragment>
      :
      null
    }
    {tree && core ? <hr /> : null}
    {core ?
      <React.Fragment>
        <DownloadForm
          link={`${path}/core-allele-distribution`}
          filename={formatCollectionFilename(collection, 'core-allele-distribution.csv')}
          genomeIds={genomeIds}
          tree={tree}
        >
        Core allele distribution
      </DownloadForm>
      <DownloadForm
        link={`${path}/score-matrix`}
        filename={formatCollectionFilename(collection, 'score-matrix.csv')}
        genomeIds={genomeIds}
        tree={tree}
      >
        Score matrix
      </DownloadForm>
      <DownloadForm
        link={`${path}/difference-matrix`}
        filename={formatCollectionFilename(collection, 'difference-matrix.csv')}
        genomeIds={genomeIds}
        tree={tree}
      >
      Difference matrix
      </DownloadForm>
      <DownloadButton
        link={`${path}/variance-summary`}
        filename={formatCollectionFilename(collection, 'variance-summary.csv')}
      >
      Variance summary
      </DownloadButton>
      </React.Fragment>
      : null
    }
  </React.Fragment>
);

DownloadsMenu.propTypes = {
  collection: React.PropTypes.object,
  core: React.PropTypes.bool,
  genomeIds: React.PropTypes.array,
  prefix: React.PropTypes.string,
  tree: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
    core: hasCore(state),
    filename: getFilenamePrefix(state),
    genomeIds: getActiveGenomeIds(state),
    path: getDownloadPath(state),
    tree: getTreeStateKey(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
