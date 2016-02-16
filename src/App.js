import React from 'react';

import Toast from './components/Toast.react';

export default ({ children }) => (
  <div>
    {children}
    <Toast />
  </div>
);
