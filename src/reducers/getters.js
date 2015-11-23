import { SET_LABEL_GETTER, SET_COLOUR_GETTER } from '../actions/getters';

import { systemColumnProps } from '../constants/metadata';
import { defaultColourGetter } from '../constants/tree';

export const labelGetter = {
  initialState: systemColumnProps[1].labelGetter,
  actions: {
    [SET_LABEL_GETTER]: function (state, { getter }) {
      return getter;
    },
  },
};

export const colourGetter = {
  initialState: defaultColourGetter,
  actions: {
    [SET_COLOUR_GETTER]: function (state, { getter }) {
      return getter || defaultColourGetter;
    },
  },
};
