import React from 'react';

import OrganismName from '../../organisms/OrganismName.react';

export default ({ genome }) => {
  const { speciesName, subspecies, serotype } = genome;

  if (speciesName) {
    return (
      <OrganismName
        abbreviated
        speciesName={speciesName}
        subspecies={subspecies}
        serotype={serotype}
      />
    );
  }

  return <span>&nbsp;</span>;
};
