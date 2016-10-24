import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import ExploreCollection from '../components/explorer';
import FetchedHeaderContent from './HeaderContent.react';
import ProcessingHeaderContent from '../components/explorer/upload-progress/Header.react';

import { statuses } from '^/constants/collection';

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

export default (
  <Route
    path="collection/:id"
    component={ExploreCollection}
    header={<HeaderSwitcher />}
  />
);
