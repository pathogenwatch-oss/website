import React from 'react';

import Tree from './TreeStoryContainer.react';

const newick =
  '(Bovine:0.69395,(Gibbon:0.36079,(Orangutan:0.33636,(Gorilla:0.17147,(Chimp:0.19268,Human:0.11927):0.08386):0.06124):0.15057):0.54939,Mouse:1.21460);';

export default {
  title: 'Visualisations/Tree',
};

export const Default = () => (
  <Tree
    phylocanvasState={{
      source: newick,
    }}
  />
);

Default.story = {
  name: 'default',
};

export const WithFontStyle = () => (
  <Tree
    phylocanvasState={{
      source: newick,
      styles: {
        Human: { fontStyle: 'bold italic', labelFillStyle: 'red', label: 'Homo sapiens' },
      },
      renderLeafLabels: true,
      fontSize: 16,
    }}
  />
);

WithFontStyle.story = {
  name: 'with font style',
};
