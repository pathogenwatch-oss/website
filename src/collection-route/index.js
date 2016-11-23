import React from 'react';
import { connect } from 'react-redux';

import FetchedHeaderContent from '../collection-viewer/HeaderContent.react';
import ProcessingHeaderContent from './upload-progress/Header.react';

import { statuses } from './constants';

export function getHeaderClassName(status) {
  if (status === statuses.READY) {
    return 'mdl-layout__header--primary mdl-shadow--3dp';
  }
  return null;
}

const mapStateToProps = ({ collection }) => ({ status: collection.status });

const HeaderSwitcher = connect(mapStateToProps)(
  ({ status }) => {
    switch (status) {
      case statuses.FETCHED:
        return <FetchedHeaderContent />;
      case statuses.PROCESSING:
        return <ProcessingHeaderContent />;
      default:
        return null;
    }
  }
);

export default {
  path: 'collection/:id',
  getComponent(_, cb) {
    return require.ensure([], require =>
      cb(null, require('./component').default)
    );
  },
  header: <HeaderSwitcher />,
};
