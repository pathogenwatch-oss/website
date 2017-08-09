import React from 'react';

import { CardMetadata } from '../../card';

import { formatDate, formatDateTime } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

function displayDate(date) {
  if (date) {
    const formattedDate = formatDate(date);
    return (
      <CardMetadata fadeOverflow tooltip={formattedDate}>
        <span>{formattedDate}</span>
      </CardMetadata>
    );
  }
  return <CardMetadata />;
}

function displayCountry(country, isTableCell) {
  const countryName = getCountryName(country);
  if (isTableCell) {
    return (
      <CardMetadata fadeOverflow>
        { country ?
          <span title={countryName}>
            <strong>{country.toUpperCase()}</strong> - {countryName}
          </span> :
          '-' }
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
      <CardMetadata fadeOverflow title="Access" icon="book">
        Reference
      </CardMetadata>
    );
  }

  if (props.public) {
    return (
      <CardMetadata fadeOverflow title="Access" icon="language">
        Public
      </CardMetadata>
    );
  }

  return (
    <CardMetadata fadeOverflow title="Uploaded At" icon="file_upload">
      {formatDateTime(props.uploadedAt)}
    </CardMetadata>
  );
}

export default ({ genome, tableCell }) => {
  const { country, date } = genome;
  return (
    <div className="wgsa-card-content">
      {displayCountry(country, tableCell)}
      {displayDate(date, tableCell)}
      {displayAccessLevel(genome)}
    </div>
  );
};
