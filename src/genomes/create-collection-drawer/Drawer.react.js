import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import CreateCollectionForm from './CreateCollectionForm.react';

import { canCreateCollection } from './selectors';

function mapStateToProps(state) {
  return {
    visible: canCreateCollection(state),
  };
}

export default connect(mapStateToProps)(({ visible }) => (
  <Drawer title="Create Collection" visible={visible}>
    <CreateCollectionForm />
  </Drawer>
));
