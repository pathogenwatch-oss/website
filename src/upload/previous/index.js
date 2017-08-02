import React from 'react';
import { connect } from 'react-redux';

import Summary from '../Summary.react';


const Component = () => (
  <div className="wgsa-hipster-style wgsa-filterable-view">
    <Summary previous />
    <div>
      <h1>Previous</h1>
    </div>
  </div>
);

export default connect()(Component);
