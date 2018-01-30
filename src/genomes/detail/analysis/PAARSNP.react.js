import React from 'react';

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
    <div>
      <h2>Antimicrobial Resistance (AMR)</h2>
      <table cellSpacing="0" className="wgsa-genome-detail-amr">
        <caption>Resistance Profile</caption>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Full Name</th>
            <th>State</th>
            <th>SNPs/Genes</th>
          </tr>
        </thead>
        <tbody>
          { filteredAntibiotics.map(({ name, fullName, state, mechanisms }) =>
            <tr key={name} className={state !== 'NOT_FOUND' ? 'wgsa-genome-detail-amr-present' : ''}>
              <td>{name}</td>
              <td>{fullName}</td>
              <td className="wgsa-genome-detail-amr-state">{state.replace(/_/g, ' ').toLowerCase()}</td>
              <td>{mechanisms.join(', ')}</td>
            </tr>
          ) }
        </tbody>
      </table>
    </div>
  );
};
