import React from 'react';

import Card from '../../card';

import Header from './Header.react';
import GenomeMetadata from './GenomeMetadata.react';
import DefaultFooter from './DefaultFooter.react';

export default ({ item }) => (
  <Card className="wgsa-genome-card wgsa-card--bordered">
    <Header genome={item} />
    <GenomeMetadata genome={item} />
    <DefaultFooter genome={item} />
  </Card>
);
