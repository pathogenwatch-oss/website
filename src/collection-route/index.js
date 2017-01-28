import React from 'react';
import { connect } from 'react-redux';

import ViewerHeaderContent from '../collection-viewer/HeaderContent.react';
import ProcessingHeaderContent from './progress/Header.react';

import { getCollection } from './selectors';

import { statuses, readyStatuses } from './constants';

export reducer from './reducers';

export function getHeaderClassName(status) {
  if (readyStatuses.has(status)) {
    return 'mdl-layout__header--primary mdl-shadow--3dp';
  }
  return null;
}

const mapStateToProps = state => ({ status: getCollection(state).status });

const HeaderSwitcher = connect(mapStateToProps)(
  ({ status }) => {
    switch (status) {
      case statuses.READY:
        return <ViewerHeaderContent />;
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
    return System.import('./component').
      then(module => cb(null, module.default));
  },
  header: <HeaderSwitcher />,
};
