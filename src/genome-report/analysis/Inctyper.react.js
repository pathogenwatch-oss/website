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

export default ({analysis}) => {
  const {inctyper, paarsnp = {matches: []}} = analysis;
  const matches = inctyper['Inc Matches'];

  matches.sort((a, b) => a.Contig.localeCompare(b.Contig));

  const amrMatches = {};

  for (const match of paarsnp.matches) {
    // Snp annotations don't have the query field.
    if (!match.query) {
      continue;
    }
    if (
      (paarsnp.hasOwnProperty('paar') && paarsnp.paar.includes(match.id)) ||
      (paarsnp.hasOwnProperty('snp') && paarsnp.snp.includes(match.id))
    ) {
      if (!(match.query.id in amrMatches)) {
        amrMatches[match.query.id] = [];
      }
      amrMatches[match.query.id].push(match.id);
    }
  }

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Plasmid Inc Types</h2>
        <p>
          Database sourced from{' '}
          <a
            href="https://cge.cbs.dtu.dk/services/PlasmidFinder/"
            target="_blank"
            rel="noopener"
          >
            https://cge.cbs.dtu.dk/services/PlasmidFinder/
          </a>
        </p>
      </header>
      <table className="bordered wide" cellSpacing="0">
        <thead>
        <tr>
          <th>Contig ID</th>
          <th>Inc Type</th>
          <th>% Identity</th>
          <th>Coverage</th>
          <th>Linked AMR Genes</th>
        </tr>
        </thead>
        <tbody>
        {matches.length ? (
          matches.map(incMatch => (
            <tr>
              <td>{incMatch.Contig}</td>
              <td>{incMatch['Inc Match']}</td>
              <td>{incMatch['Percent Identity']}</td>
              <td>{incMatch['Match Coverage']}</td>
              <td>{(amrMatches[incMatch.Contig] || []).join(', ')}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="muted">
              No matches
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </React.Fragment>
  );
};
