import { connect } from 'react-redux';

import AboutCollection from './AboutCollection.react';

import { getCollection } from '../../collection-route/selectors';
import { toggleAboutCollection } from './actions';

import Species from '../../species';

function mapStateToProps(state) {
  const { aboutCollectionOpen } = state.collection.viewer;
  return {
    isOpen: aboutCollectionOpen,
    metadata: getCollection(state).metadata,
    species: Species.current.formattedName,
  };
}

function mergeProps(state, { dispatch }) {
  return {
    ...state,
    onButtonClick: () => dispatch(toggleAboutCollection(!state.isOpen)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(AboutCollection);
