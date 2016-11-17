import React from 'react';

import ExplorerMap from '../map/Map.react';
import Summary from '../summary/Summary.react';

export default React.createClass({

  render() {
    return (
      <div>
        <ExplorerMap />
        <Summary />
      </div>
    );
  },

});
