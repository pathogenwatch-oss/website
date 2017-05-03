import React from 'react';
import { connect } from 'react-redux';

import AddToSelectionButton from './AddToSelectionButton.react';
import { FormattedName } from '../../organisms';

import { getUploadedGenomeList } from '../uploads/selectors';

import { toggleSelection } from '../selection/actions';

const stopPropagation = e => e.stopPropagation();

const Header = ({ genome, isNotUploading, onClick }) => {
  const { name, organismId, organismName } = genome;
  return (
    <header className="wgsa-card-header" onClick={onClick}>
      <h2 className="wgsa-card-title wgsa-overflow-fade" title={name}>{name}</h2>
      <p className="wgsa-card-subtitle wgsa-overflow-fade">
        { organismName ?
            <FormattedName
              organismId={organismId}
              title={organismName}
              fullName
            /> :
            <span>&nbsp;</span> }
      </p>
      { isNotUploading &&
        <span className="wgsa-card-header__button" onClick={stopPropagation}>
          <AddToSelectionButton genome={genome} />
        </span> }
    </header>
  );
};

function mapStateToProps(state, { genome }) {
  const uploadedGenomes = getUploadedGenomeList(state);
  return {
    isNotUploading: uploadedGenomes.indexOf(genome) === -1,
  };
}

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(toggleSelection(genome)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
