import './styles.css';

import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';

import Header from '../header';
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
        components={{
          header: () => <Header asideEnabled />,
          content: props => <Collections {...props} prefilter={prefilter} />,
        }}
      />
    )}
    <Redirect from="*" to="all" />
    <IndexRedirect to="all" />
  </Route>
);
