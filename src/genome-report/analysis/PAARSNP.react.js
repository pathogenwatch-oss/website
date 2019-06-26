import React from 'react';
import classnames from 'classnames';

import { taxIdMap } from '../../organisms';

const libraryLink = {
  PUBLIC: 'https://gitlab.com/cgps/pathogenwatch/amr-libraries/blob',
  TESTING: 'https://gitlab.com/cgps/pathogenwatch/amr-test-libraries/blob',
};

const originalPublicSet = new Set([ '1280', '1313', '485', '90370' ]);

export default ({ result, genome }) => {
  const { organismId } = genome.analysis.speciator;
  const {
    antibiotics,
    library = {
      label: organismId,
      source: originalPublicSet.has(organismId) ? 'PUBLIC' : 'TESTING',
      version: '0.0.1',
    },
  } = result;

  let hiddenColumns = new Set();

  if (taxIdMap.has(organismId)) {
    const { amrOptions = {} } = taxIdMap.get(organismId);
    if (amrOptions && amrOptions.hiddenColumns) {
      hiddenColumns = amrOptions.hiddenColumns;
    }
  }

  const filteredAntibiotics = hiddenColumns.size
    ? antibiotics.filter(({ name }) => !hiddenColumns.has(name))
    : antibiotics;

  const libraryUrl = `${libraryLink[library.source]}/${library.version}/${library.label}.toml`;

  return (
    <React.Fragment>
      <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
        <caption className="pw-genome-report-section-header">
          <a href={libraryUrl} target="_blank" rel="noopener" className="pw-genome-report-reference-link">
            <strong>PAARSNP AMR</strong> - Library {library.label} Version {library.version}
            {library.source !== 'PUBLIC' ? ` (${library.source})` : ''}
          </a>
        </caption>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Predicted Phenotype</th>
            <th>SNPs/Genes</th>
          </tr>
        </thead>
        <tbody>
          {filteredAntibiotics.map(({ name, fullName, state, mechanisms }) => (
            <tr
              key={name}
              className={classnames({
                'pw-genome-report-amr-present': state !== 'NOT_FOUND',
                'pw-genome-report-amr-resistant': state === 'RESISTANT',
              })}
            >
              <td>{fullName}</td>
              <td className="wgsa-genome-report-amr-state">
                {state.replace(/_/g, ' ').toLowerCase()}
              </td>
              <td className="pw-genome-report-amr-mechanisms">
                {mechanisms.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};
