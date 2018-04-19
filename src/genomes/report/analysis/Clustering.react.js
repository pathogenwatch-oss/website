import React from 'react';

import { Metadata } from '../components';

export default ({ result }) => (
  <React.Fragment>
    <h2>Clustering</h2>
    <p>Clusters have not yet been determined for this genome.</p>
    <button className="mdl-button mdl-button--raised mdl-button--colored">
      Cluster Now
    </button>
  </React.Fragment>
);
