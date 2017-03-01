import './styles.css';

import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';

import DefaultContent from '../header/DefaultContent.react';
import Collections from './Collections.react';

const prefilters = [ 'all', 'user', 'bin' ];

export reducer from './reducer';

export default (
  <Route path="collections"
    onEnter={() => {
      document.title = 'WGSA | Collections';
    }}
  >
    { prefilters.map(prefilter =>
      <Route key={prefilter} path={prefilter}
        header={<DefaultContent asideEnabled />}
        component={props => <Collections {...props} prefilter={prefilter} />}
      />
    )}
    <Redirect from="*" to="all" />
    <IndexRedirect to="all" />
  </Route>
);
