import React from 'react';
import InctyperContig from './InctyperContig.react';

// Example record.
// {
//   "Library": "gram_positive",
//   "Inc Matches": [
//     {
//       "Contig": ".ERR419050.13",
//       "Match ID": "rep19_3_CDS20(pSJH901)_CP000704",
//       "Group": "RepA_N",
//       "Inc Match": "rep19_3",
//       "Percent Identity": 100.0,
//       "Match Coverage": 100.0,
//       "Contig Start": 20625,
//       "Contig End": 21608,
//       "Reference Start": 1,
//       "Reference End": 984
//     }
//   ]
// }

function defaultView(message) {
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Plasmid Inc Types</h2>
        <p>
          <a
            href="https://cge.cbs.dtu.dk/services/PlasmidFinder/"
            target="_blank"
            rel="noopener"
          >Database sourced from https://cge.cbs.dtu.dk/services/PlasmidFinder/
          </a>
        </p>
      </header>
      <p>{message}</p>
    </React.Fragment>
  );
}

export default ({ analysis }) => {
  const { inctyper, paarsnp = { matches: [], library: '' } } = analysis;

  if (!inctyper.hasOwnProperty('Inc Matches')) {
    return defaultView('Inctyper was not run for this assembly.');
  } else if (inctyper['Inc Matches'].length === 0) {
    return defaultView('No matches reported.');
  }

  // Group inc matches by contig
  const groupedMatches = inctyper['Inc Matches'].reduce((groups, match) => {
    const updatedGroups = groups;
    if (!updatedGroups.hasOwnProperty(match.Contig)) {
      updatedGroups[match.Contig] = [];
    }
    updatedGroups[match.Contig].push(match);
    return updatedGroups;
  }, {});

  // Create a set order of the contigs for alternative row styling
  const contigOrder = Object.keys(groupedMatches).sort();

  // matches.sort((a, b) => a.Contig.localeCompare(b.Contig));

  const amrMatches = {};

  for (const match of paarsnp.matches) {
    // Snp annotations don't have the query field.
    if (!match.query) {
      continue;
    }
    if ((paarsnp.hasOwnProperty('paar') && paarsnp.paar.includes(match.id)) ||
      (paarsnp.hasOwnProperty('snp') && paarsnp.snp.includes(match.id))) {
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
          <a
            href="https://cge.cbs.dtu.dk/services/PlasmidFinder/"
            target="_blank"
            rel="noopener"
          >
            Database sourced from https://cge.cbs.dtu.dk/services/PlasmidFinder/
          </a>
        </p>
      </header>
      <table className="bordered wide" cellSpacing="0">
        <thead>
          <tr>
            <th>Contig Inc Type</th>
            {paarsnp.library !== '' && <th>Contig AMR Genes</th>}
            <th>Match ID</th>
            <th>% Identity</th>
            <th>% Coverage</th>
          </tr>
        </thead>
        {Object.keys(groupedMatches).length ? (
          contigOrder.map((contigId, index) => (
            <InctyperContig
              amrMatches={amrMatches[contigId]}
              library={inctyper.Library}
              matches={groupedMatches[contigId]}
              setBackground={index % 2 === 0}
              displayAmr={paarsnp.library !== ''}
            />
          ))
        ) : (
          <tbody>
            <tr>
              <td colSpan="5" className="muted">
                No matches
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </React.Fragment>
  );
};

