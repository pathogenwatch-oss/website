import React from 'react';

import Network from '../network';
import Container from './Container.react';

import { pwProps, cdcGraph, pwProps2 } from './props';

export default {
  title: 'Visualisations/Network',

  decorators: [ (storyFn, ctx) => <Container>{storyFn(ctx)}</Container> ],
};

export const MrCdcTest = () => (
  <Network
    style={{ width: '100%', height: '100%' }}
    graph={{
      ...cdcGraph,
      nodes: cdcGraph.nodes.map((node, i) => ({
        ...node,
        isHighlighted: i % 2 === 0,
      })),
    }}
    // graph={cdcGraph}
  />
);

MrCdcTest.story = {
  name: 'MR CDC test',
};

export const WithSigmaSettings = () => (
  <Network
    style={{ width: '100%', height: '100%' }}
    settings={{ labelThreshold: 0 }}
    graph={cdcGraph}
  />
);

WithSigmaSettings.story = {
  name: 'with Sigma settings',
};

export const WithWidthAndHeight = () => <Network width={400} height={400} graph={cdcGraph} />;

WithWidthAndHeight.story = {
  name: 'with width and height',
};

export const WithDraggableNodes = () => (
  <Network style={{ width: '100%', height: '100%' }} draggableNodes graph={cdcGraph} />
);

WithDraggableNodes.story = {
  name: 'with draggable nodes',
};

export const WithLasso = () => (
  <Network
    style={{ width: '100%', height: '100%' }}
    graph={cdcGraph}
    hasLasso
    onLassoPathChange={console.log}
  />
);

WithLasso.story = {
  name: 'with lasso',
};

export const WithLayoutDuration = () => (
  <Network
    style={{ width: '100%', height: '100%' }}
    graph={cdcGraph}
    recomputeLayout
    layoutDuration={3000}
  />
);

WithLayoutDuration.story = {
  name: 'with layout duration',
};

export const PwClusteringTest = () => (
  <Network
    {...pwProps2}
    onLayoutStart={() => console.log('layout started')}
    onLayoutChange={() => console.log('layout stopped')}
  />
);

PwClusteringTest.story = {
  name: 'PW clustering test',
};

export const WithLayoutSettings = () => (
  <Network
    {...pwProps}
    recomputeLayout
    layoutSettings={{
      iterationsPerRender: 100,
    }}
  />
);

WithLayoutSettings.story = {
  name: 'with layout settings',
};

export const WithHighlight = () => (
  <Network
    {...pwProps}
    graph={{
      ...pwProps.graph,
      nodes: pwProps.graph.nodes.map((node, i) => ({
        ...node,
        isHighlighted: i % 2 === 0,
      })),
    }}
  />
);

WithHighlight.story = {
  name: 'with highlight',
};
