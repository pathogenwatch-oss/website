export const LAYOUT_OPTIONS = {
  iterationsPerRender: 100,
  worker: true,
  barnesHutOptimize: false,
};

export const NETWORK_SETTINGS = {
  edgeColor: 'default',
  labelColor: 'node',
  labelThreshold: 0, // hack so that nodes with labels are always shown
  hideEdgesOnMove: true,
};

export const MAX_CLUSTER_SIZE = 1000;
export const MAX_DEFAULT_THRESHOLD = 10;
export const MAX_THRESHOLD = 50;
