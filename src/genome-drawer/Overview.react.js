import React from 'react';

import { FormattedName } from '../organisms';

import { getFormattedDateString, formatDateTime } from '../utils/Date';
import { getCountryName } from '../utils/country';

import { Metadata } from './components';
import ST from './analysis/ST.react';

function getAMROverview({ antibiotics }) {
  const resistances = [];
  for (const { name, state } of antibiotics) {
    if (state !== 'NOT_FOUND') {
      resistances.push(name);
    }
  }
  return resistances.join(', ');
}

export default ({ genome }) => {
  const { uploadedAt, analysis = {}, country } = genome;
  const { speciator, mlst, paarsnp, genotyphi, ngmast } = analysis;
  const date = getFormattedDateString(genome);
  return (
    <div className="wgsa-genome-overview">
      <div className="wgsa-analysis-section">
        <dl>
          <Metadata label="Organism">
            { speciator ?
              <FormattedName fullName
                organismId={speciator.organismId}
                title={speciator.organismName}
              /> :
              <em>Pending</em>
            }
          </Metadata>
          { mlst && <Metadata label="Sequence Type"><ST id={mlst.st} /></Metadata> }
          { paarsnp && <Metadata label="AMR">{getAMROverview(paarsnp)}</Metadata> }
          { genotyphi && <Metadata label="Genotype">{genotyphi.type}</Metadata>}
          { ngmast && <Metadata label="NG-MAST">{ngmast.ngmast}</Metadata> }
          { country && <Metadata label="Country">{getCountryName(country)}</Metadata> }
          <Metadata label="Date">{date}</Metadata>
          <Metadata label="Uploaded">{formatDateTime(uploadedAt)}</Metadata>
        </dl>
      </div>
    </div>
  );
};
