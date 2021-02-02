import React from 'react';
import { connect } from 'react-redux';
import { exportFile } from '@cgps/libmicroreact/utils/downloads';

import { getCollection } from '../selectors';

import { formatCollectionFilename } from './utils';

const DownloadsMenu = ({ collection }) => (
  <>
    <button onClick={() => exportFile('timeline-png', formatCollectionFilename(collection, 'timeline'))}>
      Timeline (.png)
    </button>
  </>
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
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
