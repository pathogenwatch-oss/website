import React from 'react';
import { Router, browserHistory } from 'react-router';

import App from './App.react';

import Home from '../home';
import Upload from '../hub';
import Documentation from '../documentation-viewer';
import NotFound from '../components/NotFound.react';

import Species from '../species';

const SpeciesSetter = ({ children, route }) => {
  Species.current = route.path;
  return children;
};

const routes = {
  path: '/',
  component: App,
  indexRoute: Home,
  childRoutes: [
    Upload,
    ...Species.list.map(({ nickname }) => ({
      path: nickname,
      component: SpeciesSetter,
      onEnter(router, replace) {
        if (router.location.pathname === `/${nickname}`) {
          replace(`/?species=${Species.get(nickname).id}`);
        }

        if (router.location.pathname === `/${nickname}/upload`) {
          replace('/upload');
        }
      },
      getChildRoutes(_, cb) {
        require.ensure([], require => cb(null, [
          require('../collection-route').default,
        ]));
      },
    })),
    Documentation,
    { path: '*', component: NotFound },
  ],
};

export default () => (<Router history={browserHistory} routes={routes} />);
