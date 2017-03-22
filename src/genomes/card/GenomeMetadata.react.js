import React from 'react';

import { CardMetadata } from '../../card';

import { formatDay, formatMonth } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

function displayDate(data, isTableCell) {
  if (isTableCell) {
    return (
      <CardMetadata>{data.year || ''}</CardMetadata>
    );
  }

  if (!data.day && !data.month && !data.year) {
    return null;
  }

  return (
    <CardMetadata title="Date" icon="date_range">
      {data.day ? `${formatDay(data.day)} ` : ''}
      {data.month ? `${formatMonth(data.month)} ` : ''}
      {data.year || ''}
    </CardMetadata>
  );
}

function displayCountry(country, isTableCell) {
  const countryName = getCountryName(country);
  if (isTableCell) {
    return (
      <CardMetadata fadeOverflow>
        <span title={countryName}>{countryName}</span>
      </CardMetadata>
    );
  }

  if (!country) return null;
  return (
    <CardMetadata fadeOverflow title="Country" icon="place">
      {countryName}
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

export default ({ genome, tableCell }) => {
  const { country, ...metadata } = genome;
  return (
    <div className="wgsa-card-content">
      {displayCountry(country, tableCell)}
      {displayDate(metadata, tableCell)}
      {displayAccessLevel(genome)}
    </div>
  );
};
