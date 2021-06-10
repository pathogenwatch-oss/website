import React from 'react';
import classnames from 'classnames';

const libraryLink = {
  PUBLIC: 'https://gitlab.com/cgps/pathogenwatch/amr-libraries/blob',
  TESTING: 'https://gitlab.com/cgps/pathogenwatch/amr-test-libraries/blob',
};

const originalPublicSet = new Set([ '1280', '1313', '485', '90370' ]);

function extractLocation(snp) {
  const location = snp.replace(/[A-Za-z_]+/g, '').split('-')[0];
  return location !== '' ? parseInt(location, 10) : -1;
}

function formatElements({ acquired, variants }) {
  const names = acquired.map(({ gene }) => [ gene, '' ])
    .concat(variants.map(({ gene, variant }) => [gene, variant])
    ).reduce((map, mechanismName) => {
      if (!map[mechanismName[0]]) {
        map[mechanismName[0]] = new Set();
      }
      if (mechanismName[1] !== '') {
        map[mechanismName[0]].add(mechanismName[1]);
      }
      return map;
    }, {});

  return Object.keys(names)
    .map(name => name + ((!!names[name] && names[name].size !== 0) ?
      `_${Array.from(names[name])
        .sort((a, b) => extractLocation(a) - extractLocation(b)).join('/')}` :
      ''))
    .sort()
    .join('; ');
}

export default ({ result, genome }) => {
  const { organismId } = genome.analysis.speciator;
  const {
    resistanceProfile,
    library = {
      label: organismId,
      source: originalPublicSet.has(organismId) ? 'PUBLIC' : 'TESTING',
      version: '0.0.1',
    },
  } = result;

  const libraryUrl = `${libraryLink[library.source]}/${library.version}/${library.label}.toml`;

  return (
    <React.Fragment>
      <p className="pw-genome-report-section-header">
        <a href={libraryUrl} target="_blank" rel="noopener" className="pw-genome-report-secondary-link">
          <strong>PAARSNP AMR</strong> - Library {library.label} version {library.version}
          {library.source !== 'PUBLIC' ? ` (${library.source})` : ''}
        </a>
      </p>
      <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
        <caption>Resistance profile</caption>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Inferred resistance</th>
            <th>Known Determinants</th>
          </tr>
        </thead>
        <tbody>
          {resistanceProfile.map(({ agent, state, determinants }) => (
            <tr
              key={agent.key}
              className={classnames({
                'pw-genome-report-amr-present': state !== 'NOT_FOUND',
                'pw-genome-report-amr-resistant': state === 'RESISTANT',
              })}
            >
              <td>{agent.name}</td>
              <td className="wgsa-genome-report-amr-state">
                {state.replace('NOT_FOUND', "None").toLowerCase()}
              </td>
              <td className="pw-genome-report-amr-mechanisms">
                {formatElements(determinants)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};
