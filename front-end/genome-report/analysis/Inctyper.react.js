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
        <h2>Plasmid Inc types</h2>
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
  const contigMatches = inctyper['Inc Matches'].reduce((groups, match) => {
    const updatedGroups = groups;
    if (!updatedGroups.hasOwnProperty(match.Contig)) {
      updatedGroups[match.Contig] = [];
    }
    updatedGroups[match.Contig].push(match);
    return updatedGroups;
  }, {});

  // Create a set order of the contigs for alternative row styling
  const contigOrder = Object.keys(contigMatches).sort();

  const amrMatches = paarsnp.matches
    .filter(({ queryId }) => queryId in contigMatches)
    .reduce((memo, { queryId, refId}) => {
      // Skip matches not in relevant contigs.
      // Only keep matches that are either are the acquired determinants list or contain a determinant variant.
      if (!(queryId in memo)) {
        memo[queryId] = [];
      }
      if (paarsnp.hasOwnProperty('acquired') && paarsnp.acquired.includes(refId)) {
        memo[queryId].push(queryId);
      }
      return memo;
    }, {});

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Plasmid Inc types</h2>
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
            <th>Contig Inc type</th>
            {paarsnp.library !== '' && <th>Contig AMR genes</th>}
            <th>Match ID</th>
            <th>% Identity</th>
            <th>% Coverage</th>
          </tr>
        </thead>
        {Object.keys(contigMatches).length ? (
          contigOrder.map((contigId, index) => (
            <InctyperContig
              amrMatches={amrMatches[contigId]}
              library={inctyper.Library}
              matches={contigMatches[contigId]}
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
