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
  const { uploadedAt, analysis = {}, country, userDefined = {}, latitude, longitude } = genome;
  const { specieator, mlst, paarsnp, genotyphi, ngmast } = analysis;
  console.log({ latitude, longitude }, !isNaN(latitude) && !isNaN(longitude));
  return (
    <div className="wgsa-genome-overview">
      <div className="wgsa-analysis-section">
        <dl className="wgsa-hub-stats-view">
          <Metadata label="Organism">
            { specieator ?
              <FormattedName fullName
                organismId={specieator.organismId}
                title={specieator.organismName}
              /> :
              <em>Pending</em>
            }
          </Metadata>
          { mlst && <Metadata label="Sequence Type">{mlst.st}</Metadata> }
          { paarsnp && <Metadata label="AMR">...</Metadata> }
          { genotyphi && <Metadata label="Genotype">{genotyphi.type}</Metadata>}
          { ngmast && <Metadata label="NG-MAST">{ngmast.ngmast}</Metadata> }
          { country && <Metadata label="Country">{getCountryName(country)}</Metadata> }
          {/* { !isNaN(latitude) && !isNaN(longitude) &&
            <img src={`https://maps.googleapis.com/maps/api/staticmap?zoom=12&size=640x240&maptype=roadmap&markers=color:0x3c7383|${latitude},${longitude}&key=AIzaSyA4rAT0fdTZLNkJ5o0uaAwZ89vVPQpr_Kc`} />
          } */}
          <Metadata label="Date">{getFormattedDateString(genome)}</Metadata>
          <Metadata label="Uploaded">{formatDateTime(uploadedAt)}</Metadata>
        </dl>
      </div>
      { Object.keys(userDefined).length > 0 &&
        <Section heading="Metadata">
          <dl className="wgsa-hub-stats-view">
            { Object.keys(userDefined).map(key =>
                <Metadata key={key} label={key}>{userDefined[key]}</Metadata>)
            }
          </dl>
        </Section>
      }
    </div>
  );
};
