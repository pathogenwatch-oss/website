import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import HeaderContainer from '../header';
import CollectionRoute from './route';
import ViewerHeaderContent from './component/Header.react';
import ProcessingHeaderContent from './progress/Header.react';

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
      return null;
  }
}

const Header = connect(mapStateToProps)(
  ({ status }) =>
    <HeaderContainer className={getHeaderClassName(status)}>
      {getHeaderContent(status)}
    </HeaderContainer>
);

const path = 'collection/:slug';

export const HeaderRoute = (
  <Route path={path}>
    <Header />
  </Route>
);

export default (
  <Route path={path}>
    <CollectionRoute />
  </Route>
);
