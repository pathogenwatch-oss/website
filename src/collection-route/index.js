import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import Collection from './component';
import FetchedHeaderContent from '../collection-viewer/HeaderContent.react';
import ProcessingHeaderContent from './progress/Header.react';

import { statuses, readyStatuses } from './constants';

export function getHeaderClassName(status) {
  if (readyStatuses.has(status)) {
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

export default (
  <Route
    path="collection/:id"
    component={Collection}
    header={<HeaderSwitcher />}
  />
);
