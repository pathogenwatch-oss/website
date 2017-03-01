import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';

import { getSelectedGenomeList } from './selectors';

function mapStateToProps(state) {
  return {
    items: getSelectedGenomeList(state),
  };
}

export default connect(mapStateToProps)(({ items }) => (
  <Drawer
    title={`${items.length} genome${items.length === 1 ? '' : 's'} selected.`}
    visible={items.length > 0}
  >
    <ol>
      {
        items.map(({ id, name }) => <li key={id}>{ name }</li>)
      }
    </ol>
  </Drawer>
));
