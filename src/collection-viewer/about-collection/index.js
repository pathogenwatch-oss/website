import { connect } from 'react-redux';

import AboutCollection from './AboutCollection.react';

import { getViewer } from '../../collection-viewer/selectors';

import { getCollection } from '../../collection-viewer/selectors';
import { toggleAboutCollection } from './actions';

import Organisms from '../../organisms';

function mapStateToProps(state) {
  const { aboutCollectionOpen } = getViewer(state);
  return {
    isOpen: aboutCollectionOpen,
    metadata: getCollection(state).metadata,
    organism: Organisms.current.formattedName,
  };
}

function mergeProps(state, { dispatch }) {
  return {
    ...state,
    onButtonClick: () => dispatch(toggleAboutCollection(!state.isOpen)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(AboutCollection);
