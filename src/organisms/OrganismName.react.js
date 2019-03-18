import React from 'react';

function getTitle({ speciesName, subspecies, serotype }) {
  // Intended for Salmonellae
  if (speciesName && subspecies && serotype) {
    return `${speciesName} subspecies ${subspecies} serovar ${serotype}`;
  }
  if (speciesName && serotype) {
    return `${speciesName} serotype ${serotype}`;
  }
  return speciesName;
}

function getFormatted({ speciesName, subspecies, serotype, abbreviated }) {
  // Intended for Salmonellae
  if (speciesName && subspecies && serotype) {
    return (
      <React.Fragment>
        <em>{speciesName}</em> {abbreviated ? 'subsp.' : 'subspecies'}{' '}
        <em>{subspecies}</em> {abbreviated ? 'ser.' : 'serovar'} {serotype}
      </React.Fragment>
    );
  }
  if (speciesName && serotype) {
    return (
      <React.Fragment>
        <em>{speciesName}</em> {abbreviated ? 'ser.' : 'serotype'}{' '}
        <strong>{serotype}</strong>
      </React.Fragment>
    );
  }
  return <em>{speciesName}</em>;
}

export default props => (
  <span title={getTitle(props)}>{getFormatted(props)}</span>
);
