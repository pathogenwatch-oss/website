import React from 'react';

import { Section } from './components';
import { FormattedName } from '../organisms';

import { getFormattedDateString, formatDateTime } from '../utils/Date';
import { getCountryName } from '../utils/country';

const Metadata = ({ label, children }) => (
  children ?
  <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
    <dt className="wgsa-hub-stats-heading">{label}</dt>
    <dd className="wgsa-hub-stats-value">{children}</dd>
  </span> :
  null
);

export default ({ genome }) => {
  const { uploadedAt, analysis = {}, country, userDefined = {} } = genome;
  const { specieator } = analysis;
  return (
    <div>
      <div className="wgsa-analysis-section">
        <dl className="wgsa-hub-stats-view">
          <Metadata label="Organism">
            { specieator ?
              <FormattedName fullName
                organismId={specieator.organismId}
                title={specieator.organismName}
              /> :
              <em>Pending</em> }
          </Metadata>
          <Metadata label="Uploaded">{formatDateTime(uploadedAt)}</Metadata>
          <Metadata label="Country">{getCountryName(country)}</Metadata>
          <Metadata label="Date">{getFormattedDateString(genome)}</Metadata>
        </dl>
      </div>
      { Object.keys(userDefined).length > 0 &&
        <Section heading="User defined">
          <dl className="wgsa-hub-stats-view">
            { Object.keys(userDefined).map(key =>
              <Metadata key={key} label={key}>{userDefined[key]}</Metadata>
            )}
          </dl>
        </Section> }
    </div>
  );
};
