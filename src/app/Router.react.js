import React from 'react';
import { Router, browserHistory } from 'react-router/es';

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
  getComponent(_, cb) {
    return System.import('./App.react').
      then(module => cb(null, module.default));
  },
  getIndexRoute(_, cb) {
    return System.import('../home').
      then(module => cb(null, module.default));
  },
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
        System.import('../collection-route').
          then(module => cb(null, [ module.default ]));
      },
    })),
    Documentation,
    { path: '*', component: NotFound },
  ],
};

export default () => (<Router history={browserHistory} routes={routes} />);
