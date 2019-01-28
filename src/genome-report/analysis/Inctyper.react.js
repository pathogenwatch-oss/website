import React from 'react';

// Example record.
// "Inc Matches": [
//     {
//     "Contig": "tig00000033|quiver",
//     "Inc Match": "IncA/C_1__FJ705807",
//     "Percent Identity": 98.321,
//     "Match Coverage": 1.0,
//     "Contig Start": 89119,
//     "Contig End": 89535,
//     "Reference Start": 1,
//     "Reference End": 417
//    }
// ]

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Plasmid Inc Types</h2>
      <span>
        Database sourced from{' '}
        <a
          href="https://cge.cbs.dtu.dk/services/PlasmidFinder/"
          target="_blank"
          rel="noopener"
        >
          https://cge.cbs.dtu.dk/services/PlasmidFinder/
        </a>
      </span>
    </header>
    <table className="bordered wide" cellSpacing="0">
      <thead>
        <tr>
          <th>Inc Match</th>
          <th>Contig</th>
          <th>% Identity</th>
          <th>Coverage</th>
        </tr>
      </thead>
      <tbody>
        {result['Inc Matches'].map(incMatch => (
          <tr>
            <td>{incMatch['Inc Match']}</td>
            <td>{incMatch.Contig}</td>
            <td>{incMatch['Percent Identity']}</td>
            <td>{incMatch.Coverage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </React.Fragment>
);
