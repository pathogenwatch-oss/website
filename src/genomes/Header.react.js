import React from 'react';
import { connect } from 'react-redux';

import { Header } from '../header';
import { isAsideEnabled } from './selectors';

function mapStateToProps(state) {
  return {
    asideEnabled: isAsideEnabled(state),
  };
}

export default connect(mapStateToProps)(
  ({ asideEnabled }) => <Header asideEnabled={asideEnabled} />
);
