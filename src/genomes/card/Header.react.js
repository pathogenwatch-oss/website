import React from 'react';
import { connect } from 'react-redux';

import AddToSelectionButton from './AddToSelectionButton.react';
import { FormattedName } from '../../organisms';

import { toggleSelectedGenomes } from '../selection/actions';

const stopPropagation = e => e.stopPropagation();

const Header = ({ genome, onClick }) => {
  const { name, speciesId, speciesName } = genome;
  return (
    <header className="wgsa-card-header" onClick={onClick}>
      <h2 className="wgsa-card-title" title={name}>{name}</h2>
      <p className="wgsa-card-subtitle">
        { speciesName ?
            <FormattedName
              speciesId={speciesId}
              title={speciesName}
              fullName
            /> :
            <span>&nbsp;</span> }
      </p>
      <span className="wgsa-card-header__button" onClick={stopPropagation}>
        <AddToSelectionButton genome={genome} />
      </span>
    </header>
  );
};


function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(toggleSelectedGenomes([ genome ])),
  };
}

export default connect(null, mapDispatchToProps)(Header);
