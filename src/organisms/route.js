import React from 'react';
import { Redirect, Route, IndexRoute } from 'react-router';

import Index from './index-page';
import Details from './details-page';

const supportedOrganisms = require('../../universal/organisms');

export default (
  <Route path="organisms">
    <IndexRoute component={Index} />
    { supportedOrganisms.map(({ nickname }) =>
        <Redirect key={`${nickname}-redirect`} from={`/${nickname}`} to={nickname} />
    )}
    { supportedOrganisms.map(
        ({ id, nickname }) =>
          <Route
            key={nickname}
            path={nickname}
            component={props => <Details {...props} organismId={id} />}
          />
    )}
  </Route>
);
