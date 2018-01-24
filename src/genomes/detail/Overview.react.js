import React from 'react';

import { FormattedName } from '../../organisms';

import { getFormattedDateString, formatDateTime } from '../../utils/Date';
import { getCountryName } from '../../utils/country';

import { Metadata } from './components';
import ST from '../../mlst/ST.react';

function getAMROverview({ antibiotics }) {
  const resistances = [];
  for (const { name, state } of antibiotics) {
    if (state !== 'NOT_FOUND') {
      resistances.push(name);
    }
  }
  return resistances.join(', ');
}

function getTask({ analysis = {}, tasks = [] }, taskName) {
  return analysis[taskName];
}

export default ({ genome }) => {
  const { uploadedAt, country } = genome;
  const speciator = getTask(genome, 'speciator');
  const mlst = getTask(genome, 'mlst');
  const paarsnp = getTask(genome, 'paarsnp');
  const genotyphi = getTask(genome, 'genotyphi');
  const ngmast = getTask(genome, 'ngmast');
  const date = getFormattedDateString(genome);
  return (
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
      { genotyphi && <Metadata label="Genotype">{genotyphi.genotype}</Metadata>}
      { ngmast && <Metadata label="NG-MAST">{ngmast.ngmast}</Metadata> }
      { country && <Metadata label="Country">{getCountryName(country)}</Metadata> }
      <Metadata label="Date">{date}</Metadata>
      <Metadata label="Uploaded">{formatDateTime(uploadedAt)}</Metadata>
    </dl>
  );
};
