import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import Index from './index-page';
import Details from './details-page';

const supportedOrganisms = require('../../universal/organisms');

const path = '/organisms';

export const OrganismRedirects =
  supportedOrganisms.map(({ nickname }) =>
    <Redirect key={`${nickname}-redirect`} exact
      from={`/${nickname}`} to={`${path}/${nickname}`}
    />
  );

export const OrganismDetails =
  supportedOrganisms.map(({ id, nickname }) =>
    <Route key={nickname}
      path={`${path}/${nickname}`}
      component={props => <Details {...props} organismId={id} />}
    />
  );

export default <Route exact path={path} component={Index} />;
