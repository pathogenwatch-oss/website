import React from 'react';
import { connect } from 'react-redux';

import AddToSelectionButton from '../card/AddToSelectionButton.react';
import { FormattedName } from '../../organisms';
import { formatDate, formatDateTime } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

import { showGenomeDrawer } from '../../genome-drawer';

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
    <Cell title="Uploaded At" icon="file_upload">
      {formatDateTime(props.uploadedAt)}
    </Cell>
  );
};

const ListItem = ({ item, onClick, style }) => {
  const { name, organismId, organismName, st, country } = item;
  const countryName = country ? getCountryName(country) : null;
  const date = item.date ? formatDate(item.date) : null;
  return (
    <div
      className="wgsa-genome-list-item wgsa-genome-list-item--selectable wgsa-card--bordered"
      style={style}
      onClick={onClick}
      title="View Details"
    >
      <Cell title={name}>{name}</Cell>
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
        <Cell>{st}</Cell> :
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
      <span onClick={e => e.stopPropagation()} className="wgsa-genome-list-cell">
        <AddToSelectionButton genome={item} />
      </span>
    </div>
  );
};

function mapDispatchToProps(dispatch, { item }) {
  return {
    onClick: () => dispatch(showGenomeDrawer(item.id, item.name)),
  };
}

export default connect(null, mapDispatchToProps)(ListItem);
