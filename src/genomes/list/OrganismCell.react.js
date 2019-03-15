import React from 'react';

import { FormattedName } from '../../organisms';

function getTitle({ organismName, serotype }) {
  if (serotype) {
    return `${organismName} ser. ${serotype}`;
  }
  return organismName;
}

function getFormatted({ organismName, serotype }) {
  if (serotype) {
    return (
      <span>
        <em>{organismName}</em> ser. <strong>{serotype}</strong>
      </span>
    );
  }
  return organismName;
}

export default ({ genome }) => {
  const { organismId, organismName } = genome;

  if (organismName) {
    return (
      <FormattedName organismId={organismId} title={getTitle(genome)}>
        {getFormatted(genome)}
      </FormattedName>
    );
  }

  return <span>&nbsp;</span>;
};
