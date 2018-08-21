import React from 'react';
import classnames from 'classnames';

import { taxIdMap } from '../../../organisms';

export default ({ result, genome }) => {
  const { antibiotics } = result;
  const { organismId } = genome;
  let hiddenColumns = new Set();

  if (taxIdMap.has(organismId)) {
    const { amrOptions = {} } = taxIdMap.get(organismId);
    if (amrOptions && amrOptions.hiddenColumns) {
      hiddenColumns = amrOptions.hiddenColumns;
    }
  }

  const filteredAntibiotics =
    hiddenColumns.size ?
      antibiotics.filter(({ name }) => !hiddenColumns.has(name)) :
      antibiotics;

  return (
    <React.Fragment>
      <h2>Antimicrobial Resistance (AMR)</h2>
      <table cellSpacing="0" className="wgsa-genome-report-amr bordered">
        <caption>Resistance Profile</caption>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Full Name</th>
            <th>Genotype</th>
            <th>SNPs/Genes</th>
          </tr>
        </thead>
        <tbody>
          { filteredAntibiotics.map(({ name, fullName, state, mechanisms }) =>
            <tr key={name}
              className={classnames({
                'pw-genome-report-amr-present': state !== 'NOT_FOUND',
                'pw-genome-report-amr-resistant': state === 'RESISTANT',
              })}
            >
              <td>{name}</td>
              <td>{fullName}</td>
              <td className="wgsa-genome-report-amr-state">{state.replace(/_/g, ' ').toLowerCase()}</td>
              <td className="pw-genome-report-amr-mechanisms">
                { mechanisms.join(', ') }
              </td>
            </tr>
          ) }
        </tbody>
      </table>
    </React.Fragment>
  );
};
