import './styles.css';

import Home from './Home.react';

export default {
  component: Home,
  onEnter() {
    document.title = 'WGSA | Home';
  },
};
