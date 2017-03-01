import React from 'react';
import { Redirect, Route, IndexRoute } from 'react-router';

import Index from './index-page';
import Details from './details-page';

const supportedSpecies = require('../../universal/species');

export default (
  supportedSpecies.map(({ nickname, id }) =>
    <Redirect key={nickname} from={nickname} to="/genomes" query={{ speciesId: id }} />
  ).concat([
    <Route path="species">
      <IndexRoute component={Index} />
      { supportedSpecies.map(
          ({ id, nickname }) =>
            <Route
              key={nickname}
              path={nickname}
              component={props => <Details {...props} speciesId={id} />}
            />
      )}
    </Route>,
  ])
);
