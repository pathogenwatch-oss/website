import { connect } from 'react-redux';

import AboutCollection from './AboutCollection.react';
import { toggleAboutCollection } from './actions';

import Species from '../../species';

function mapStateToProps({ collection, collectionViewer }) {
  return {
    isOpen: collectionViewer.aboutCollectionOpen,
    metadata: collection.metadata,
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
