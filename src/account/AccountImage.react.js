import React from 'react';

import config from '../app/config';

const { user = { photo: '/images/user.svg' } } = config;
const src = user.photo || '/images/user-signed-in.svg';

export default () => (
  <img src={src} className="cgps-avatar__image" />
);
