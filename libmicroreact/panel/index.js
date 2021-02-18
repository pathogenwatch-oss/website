import './Panel.css';

import React from 'react';

import PurePanel from './Panel.react';

export { PurePanel };

export default props => {
  const [ controlsVisible, setControlsVisible ] = React.useState(false);
  return (
    <PurePanel
      {...props}
      controlsVisible={controlsVisible}
      onControlsVisibleChange={setControlsVisible}
    />
  );
};
