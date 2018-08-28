import React from 'react';
import { connect } from 'react-redux';

import { Header } from '../header';
import ViewerHeaderContent from './component/Header.react';
import DefaultHeaderContent from '../header/DefaultContent.react';

import { getCollection } from './selectors';

import { statuses } from './constants';

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
    default:
      return <DefaultHeaderContent />;
  }
}

export default connect(mapStateToProps)(
  ({ status }) =>
    <Header className={getHeaderClassName(status)}>
      {getHeaderContent(status)}
    </Header>
);
