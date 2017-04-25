import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import Tabs from './Tabs.react';

import { getSelectedGenomeList } from './selectors';

function getSelectionTitle(selectedGenomes) {
  return (
    <span>
      <span className="wgsa-genome-total">{selectedGenomes.length}</span>&nbsp;
      {` Genome${selectedGenomes.length === 1 ? '' : 's'} Selected`}
    </span>
  );
}

const SelectionDrawer = ({ visible, title }) => (
  <Drawer title={title} visible={visible}>
    <Tabs />
  </Drawer>
);

function mapStateToProps(state) {
  const selectedGenomes = getSelectedGenomeList(state);
  return {
    visible: selectedGenomes.length > 0,
    title: getSelectionTitle(selectedGenomes),
  };
}

export default connect(mapStateToProps)(SelectionDrawer);
