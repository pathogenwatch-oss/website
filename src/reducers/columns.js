import { SET_LABEL_COLUMN, SET_COLOUR_COLUMN } from '../actions/columns';

import { systemColumnProps } from '../constants/metadata';
import { defaultColourGetter } from '../constants/tree';

const defaultColourColumn = {
  valueGetter: defaultColourGetter,
};

export const labelColumn = {
  initialState: systemColumnProps[1],
  actions: {
    [SET_LABEL_COLUMN]: function (state, { column }) {
      return column;
    },
  },
};

export const colourColumn = {
  initialState: defaultColourColumn,
  actions: {
    [SET_COLOUR_COLUMN]: function (state, { column }) {
      return column || defaultColourColumn;
    },
  },
};
