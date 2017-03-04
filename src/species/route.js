import React from 'react';
import { Redirect, Route, IndexRoute } from 'react-router';

import Index from './index-page';
import Details from './details-page';

const supportedSpecies = require('../../universal/species');

export default (
  <Route key="species" path="species">
    <IndexRoute component={Index} />
    { supportedSpecies.map(({ nickname }) =>
        <Redirect key={`${nickname}-redirect`} from={`/${nickname}`} to={nickname} />
    )}
    { supportedSpecies.map(
        ({ id, nickname }) =>
          <Route
            key={nickname}
            path={nickname}
            component={props => <Details {...props} speciesId={id} />}
          />
    )}
  </Route>
);
