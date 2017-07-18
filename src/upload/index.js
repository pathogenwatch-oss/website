import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';

import Upload from './Upload.react';

export reducer from './reducer';

export default <Route path="/upload" component={Upload} />;
