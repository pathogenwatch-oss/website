import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { Header } from '../header';
import CollectionRoute from './route';
import ViewerHeaderContent from './component/Header.react';
import ProcessingHeaderContent from './progress/Header.react';
import DefaultHeaderContent from '../header/DefaultContent.react';

import { getCollection } from './selectors';

import { statuses } from './constants';

export reducer from './reducer';

const mapStateToProps = state => ({ status: getCollection(state).status });

function getHeaderClassName(status) {
  if (status === statuses.READY) {
    return 'mdl-layout__header--primary mdl-shadow--3dp';
  }
  return null;
}

function getHeaderContent(status) {
  switch (status) {
    case statuses.READY:
      return <ViewerHeaderContent />;
    case statuses.PROCESSING:
      return <ProcessingHeaderContent />;
    default:
      return <DefaultHeaderContent />;
  }
}

const ViewerHeader = connect(mapStateToProps)(
  ({ status }) =>
    <Header className={getHeaderClassName(status)}>
      {getHeaderContent(status)}
    </Header>
);

const path = '/collection/:slug';

export const HeaderRoute = (
  <Route path={path} component={ViewerHeader} />
);

export default (
  <Route path={path} component={CollectionRoute} />
);
