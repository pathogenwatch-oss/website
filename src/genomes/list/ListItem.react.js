import React from 'react';
import { connect } from 'react-redux';

import { toggleSelection } from '../selection/actions';

import AddToSelection from '../selection/AddToSelection.react';
import { FormattedName } from '../../organisms';
import { formatDate, formatDateTime } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

import { showGenomeDrawer } from '../../genome-drawer';
import ST from '../../genome-drawer/analysis/ST.react';

const Cell = ({ title, icon, children }) => (
  <span
    className="wgsa-genome-list-cell wgsa-overflow-fade"
    title={title}
  >
    { icon && <i title={title} className="material-icons">{icon}</i> }
    {children}
  </span>
);

const EmptyCell = (
  <span className="wgsa-genome-list-cell wgsa-overflow-fade"></span>
);

const displayAccessLevel = (props) => {
  if (props.reference) {
    return (
      <Cell title="Access" icon="book">
        Reference
      </Cell>
    );
  }

  if (props.public) {
    return (
      <Cell title="Access" icon="language">
        Public
      </Cell>
    );
  }

  return (
    <Cell title={`Uploaded at ${props.uploadedAt}`} icon="person">
      Private
    </Cell>
  );
};

const ListItem = ({ item, onClick, style, onViewGenome }) => {
  const { name, organismId, organismName, st, country } = item;
  const countryName = country ? getCountryName(country) : null;
  const date = item.date ? formatDate(item.date) : null;
  return (
    <div
      className="wgsa-genome-list-item wgsa-genome-list-item--selectable wgsa-card--bordered"
      style={style}
      onClick={onClick}
    >
      <Cell title={name} onClick={e => e.stopPropagation()}>
        <AddToSelection genome={item} />
        <button title="View Details" className="wgsa-link-button" onClick={onViewGenome}>
          {name}
        </button>
      </Cell>
      <Cell>
        { organismName ?
            <FormattedName
              organismId={organismId}
              title={organismName}
              fullName
            /> :
            <span>&nbsp;</span> }
      </Cell>
      { st ?
        <Cell><ST id={st} /></Cell> :
        EmptyCell }
      { country ?
        <Cell title={countryName}>
          <strong>{country.toUpperCase()}</strong> - {countryName}
        </Cell> :
        EmptyCell }
      { date ?
        <Cell title={date}>{date}</Cell> :
        EmptyCell }
      {displayAccessLevel(item)}
    </div>
  );
};

function mapDispatchToProps(dispatch, { item }) {
  return {
    onViewGenome: e => e.stopPropagation() || dispatch(showGenomeDrawer(item.id, item.name)),
    onClick: () => dispatch(toggleSelection(item)),
  };
}

export default connect(null, mapDispatchToProps)(ListItem);
