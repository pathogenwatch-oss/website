import React from 'react';

// Example record.
// [
//   {
//     "Contig": "tig00000033|quiver",
//     "Inc Match": "IncA/C_1__FJ705807",
//     "Percent Identity": 98.321,
//     "Match Coverage": 1.0,
//     "Contig Start": 89119,
//     "Contig End": 89535,
//     "Reference Start": 1,
//     "Reference End": 417
//   }
// ]

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Plasmid Inc Types</h2>
      <a href="" target="_blank" rel="noopener">Database sourced from
        https://cge.cbs.dtu.dk/services/PlasmidFinder/</a>
    </header>
    <table className="inctyper-table" cellSpacing="0">
      <thead>
      <tr>
        {[ 'Inc Match', 'Contig', 'Percent Identity', 'Coverage' ]
          .map((fieldName) =>
            <th key={fieldName}>{fieldName}</th>)}
      </tr>
      </thead>
      <tbody>
      {result.map((incMatch) =>
        <tr>
          {[ 'Inc Match', 'Contig', 'Percent Identity', 'Coverage' ]
            .map((fieldName) =>
              <td key={fieldName}>{incMatch[fieldName]}</td>)}
        </tr>,
      )}
      </tbody>
    </table>
  </React.Fragment>
);
