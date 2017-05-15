import React from 'react';
import { Switch } from 'react-router-dom';

import { HeaderRoute as viewerHeader } from '../collection-viewer';
import { HeaderRoute as collectionsHeader } from '../collections';
import { HeaderRoute as genomesHeader } from '../genomes';
import defaultHeader from '../header';

export default () => (
  <Switch>
    { genomesHeader }
    { collectionsHeader }
    { viewerHeader }
    { defaultHeader }
  </Switch>
);
