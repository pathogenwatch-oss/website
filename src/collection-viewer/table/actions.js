export const SET_TABLE = 'SET_TABLE';

export function setTable(name) {
  return {
    type: SET_TABLE,
    payload: {
      name,
    },
  };
}

export const SET_LABEL_COLUMN = 'SET_LABEL_COLUMN';

export function setLabelColumn(column) {
  return {
    type: SET_LABEL_COLUMN,
    payload: {
      column,
    },
  };
}

export const SET_COLOUR_COLUMNS = 'SET_COLOUR_COLUMNS';

export function setColourColumns(columns) {
  return {
    type: SET_COLOUR_COLUMNS,
    payload: {
      columns,
    },
  };
}
