import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';

import Homepage from './Homepage.react';

export default <Route exact path="/" component={Homepage} />;
