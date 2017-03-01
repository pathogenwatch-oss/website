import React from 'react';

import { CardMetadata } from '../../card';

import { formatDay, formatMonth } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

import { FormattedSpeciesName } from '../../species';

function displayDate({ day, month, year }) {
  if (!day && !month && !year) {
    return null;
  }
  return (
    <CardMetadata title="Date" icon="date_range">
      {day ? `${formatDay(day)} ` : ''}
      {month ? `${formatMonth(month)} ` : ''}
      {year || ''}
    </CardMetadata>
  );
}

function displayCountry(country) {
  if (!country) return null;
  return (
    <CardMetadata title="Country" icon="place">
      <span>{getCountryName(country)}</span>
    </CardMetadata>
  );
}

function displayAccessLevel(props) {
  if (props.reference) {
    return (
      <CardMetadata title="Access" icon="book">
        Reference
      </CardMetadata>
    );
  }

  if (props.public) {
    return (
      <CardMetadata title="Access" icon="language">
        Public
      </CardMetadata>
    );
  }

  return (
    <CardMetadata title="Access" icon="lock_outline">
      Private
    </CardMetadata>
  );
}

export default props => {
  const { country, ...metadata } = props;
  return (
    <div className="wgsa-card-content">
      {displayCountry(country)}
      {displayDate(metadata)}
      {displayAccessLevel(props)}
    </div>
  );
};
