import React from 'react';

import { CardMetadata } from '../../card';

import { getFormattedDateString, formatDateTime } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

function displayDate(data, isTableCell) {
  const formattedDateString = getFormattedDateString(data);

  if (isTableCell) {
    return (
      <CardMetadata tooltip={formattedDateString}>
        <span>{formattedDateString}</span>
      </CardMetadata>
    );
  }

  if (!data.day && !data.month && !data.year) {
    return null;
  }

  return (
    <CardMetadata title="Date" icon="date_range">
      {formattedDateString}
    </CardMetadata>
  );
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
    <CardMetadata fadeOverflow title="Uploaded At" icon="access_time">
      {formatDateTime(props.uploadedAt)}
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
