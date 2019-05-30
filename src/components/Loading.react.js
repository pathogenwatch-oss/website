import React from 'react';

import Fade from './fade';

export default ({ complete, placeholder, children, wait = 280 }) => {
  const [ waited, setWaited ] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setWaited(true), wait);
  }, []);
  return (
    <Fade>
      { complete && waited ?
        React.cloneElement(children, { key: 'loaded' }) :
        React.cloneElement(placeholder, { key: 'loading' })
      }
    </Fade>
  );
}
;
