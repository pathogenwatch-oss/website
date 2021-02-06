import React from 'react';

import History from './index';
import TreeDemo from './TreeDemo.react';

import history1 from './images/history1.png';
import history2 from './images/history2.png';
import history3 from './images/history3.png';

const testEntries = [ history3, history2, history1 ];

export default {
  title: 'Core/History',
};

export const Styles = () => {
  const [ current, setCurrent ] = React.useState(0);
  return (
    <div style={{ width: 240 }}>
      <History entries={testEntries} current={current} onTravel={setCurrent} />
    </div>
  );
};

export const _TreeDemo = () => <TreeDemo />;
