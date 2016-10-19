import '../css/card.css';

import React from 'react';
import { connect } from 'react-redux';

import { removeFasta } from '../thunks';

export const FastaCard =
  ({ children, onRemoveButtonClick }) => (
    <div className="wgsa-hub-card__content">
      {children}
      <div className="wgsa-card-footer">
        <button
          className="wgsa-remove-fasta-button mdl-button mdl-button--icon"
          title="Remove"
          onClick={onRemoveButtonClick}
        >
          <i className="material-icons">delete</i>
        </button>
      </div>
    </div>
  );

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onRemoveButtonClick: () => dispatch(removeFasta(ownProps.name)),
  };
}

export default connect(null, mapDispatchToProps)(FastaCard);
