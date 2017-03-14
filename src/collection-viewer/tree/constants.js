import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import { CGPS, DEFAULT } from '../../app/constants';

export const simpleTrees = new Set([ POPULATION, COLLECTION ]);

export const titles = {
  [POPULATION]: 'Population',
  [COLLECTION]: 'Collection',
};

export const defaultLeafStyle = {
  strokeStyle: DEFAULT.COLOUR,
  lineWidth: 1,
};

export const leafStyles = {
  subtree: {
    labelStyle: {
      colour: CGPS.COLOURS.PURPLE,
      format: 'bold',
    },
    shape: 'triangle',
  },
  collection: {
    labelStyle: {
      colour: CGPS.COLOURS.PURPLE,
      format: 'bold',
    },
    shape: 'circle',
  },
  public: {
    labelStyle: {
      colour: 'rgba(33, 33, 33, 1)',
    },
    shape: 'square',
  },
  reference: {
    labelStyle: {
      colour: 'rgba(33, 33, 33, 1)',
      format: 'bold',
    },
    shape: 'triangle',
  },
};
