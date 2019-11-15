import React from 'react';

const callsItSerovar = new Set([
  'Salmonella enterica',
]);

function getSeroName(speciesName) {
  if (callsItSerovar.has(speciesName)) {
    return 'serovar';
  }
  return 'serotype';
}

function getTitle({ speciesName, subspecies, serotype }) {
  const seroName = getSeroName(speciesName);
  if (speciesName && subspecies && serotype) {
    return `${speciesName} subspecies ${subspecies} ${seroName} ${serotype}`;
  }
  if (speciesName && serotype) {
    return `${speciesName} ${seroName} ${serotype}`;
  }
  return speciesName;
}

function getFormatted({ speciesName, subspecies, serotype, abbreviated }) {
  const seroName = getSeroName(speciesName);
  if (speciesName === 'Salmonella enterica' && serotype) {
    return <React.Fragment><em>Salmonella</em> {serotype}</React.Fragment>;
  }
  if (speciesName && subspecies && serotype) {
    return (
      <React.Fragment>
        <em>{speciesName}</em> {abbreviated ? 'subsp.' : 'subspecies'}{' '}
        <em>{subspecies}</em> {abbreviated ? 'ser.' : seroName} {serotype}
      </React.Fragment>
    );
  }
  if (speciesName && serotype) {
    return (
      <React.Fragment>
        <em>{speciesName}</em> {abbreviated ? 'ser.' : seroName}{' '}
        <strong>{serotype}</strong>
      </React.Fragment>
    );
  }
  return <em>{speciesName}</em>;
}

export default props => (
  <span title={getTitle(props)}>{getFormatted(props)}</span>
);
