import React from 'react';

import { FormattedName } from '../organisms';

import { getFormattedDateString, formatDateTime } from '../utils/Date';
import { getCountryName } from '../utils/country';

import { Metadata } from './components';

function getAMROverview({ antibiotics }) {
  const resistances = [];
  for (const key of Object.keys(antibiotics)) {
    if (antibiotics[key].state !== 'NOT_FOUND') {
      resistances.push(key);
    }
  }
  return resistances.join(', ');
}

export default ({ genome }) => {
  const { uploadedAt, analysis = {}, country, year } = genome;
  const { specieator, mlst, paarsnp, genotyphi, ngmast } = analysis;
  const date = getFormattedDateString(genome);
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
