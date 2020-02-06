import React from 'react';
import classnames from 'classnames';

import { taxIdMap } from '../../organisms';

const libraryLink = {
  PUBLIC: 'https://gitlab.com/cgps/pathogenwatch/amr-libraries/blob',
  TESTING: 'https://gitlab.com/cgps/pathogenwatch/amr-test-libraries/blob',
};

const originalPublicSet = new Set([ '1280', '1313', '485', '90370' ]);

function formatElement(snp) {
  const parts = snp.split('_');
  if (parts[parts.length - 1].match(/^(-+|ins|[A-Za-z]+)(-?[0-9]+)(-+|del|[A-Za-z]+)$/)) {
    return [ parts.slice(0, -1).join('_'), parts[parts.length - 1] ];
  }

  const result = [ '_disrupted', '_frameshift', '_truncated' ]
    .find(variant => snp.endsWith(variant));
  if (!!result) {
    return [ snp.replace(result, ''), result ];
  }

  if (snp.match('aa_insert') || snp.match('nt_insert')) {
    return [ parts.slice(0, -3).join('_'), parts.slice(-3).join('_') ];
  }
  return [ snp, '' ];
}

function extractLocation(snp) {
  const location = snp.replace(/[A-Za-z_]+/g, '').split('-')[0];
  return location !== '' ? parseInt(location, 10) : -1;
}

function formatElements(mechanisms, paar) {
  const elementMap = mechanisms
    .map(mechanism => (paar.includes(mechanism) ? [ mechanism, '' ] : formatElement(mechanism)))
    .reduce((map, mechanismName) => {
      if (!map[mechanismName[0]]) {
        map[mechanismName[0]] = new Set();
      }
      if (mechanismName[1] !== '') {
        map[mechanismName[0]].add(mechanismName[1]);
      }
      return map;
    }, {});

  return Object.keys(elementMap)
    .map(name => name + ((!!elementMap[name] && elementMap[name].size !== 0) ?
      `_${Array.from(elementMap[name])
        .sort((a, b) => extractLocation(a) - extractLocation(b)).join('/')}` :
      ''))
    .sort()
    .join('; ');
}

export default ({ result, genome }) => {
  const { organismId } = genome.analysis.speciator;
  const {
    antibiotics,
    paar,
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

  const libraryUrl = `${libraryLink[library.source]} /${library.version}/${library.label}.toml`;

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
            <th>Predicted phenotype</th>
            <th>Variants/genes</th>
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
                {formatElements(mechanisms, paar)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};
