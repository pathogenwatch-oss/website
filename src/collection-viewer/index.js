import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import CollectionRoute from './route';
import ViewerHeaderContent from './component/Header.react';
import ProcessingHeaderContent from './progress/Header.react';

import { getCollection } from './selectors';

import { statuses } from './constants';

export reducer from './reducer';

export function getHeaderClassName(status) {
  if (status === statuses.READY) {
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

export default (
  <Route
    path="collection/:slug"
    component={CollectionRoute}
    header={<HeaderSwitcher />}
  />
);
