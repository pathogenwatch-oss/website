import './styles.css';

import React from 'react';
import { IndexRoute } from 'react-router';

import Home from './Home.react';

// const initialState = {
//   textFilter: null,
//   species: null,
//   date: {
//     min: null,
//     max: null,
//   },
// };

// export function reducer(state = initialState, { type, payload }) {
//
// }

export default (
  <IndexRoute
    component={Home}
    onEnter={() => {
      document.title = 'WGSA | Home';
    }}
  />
);
