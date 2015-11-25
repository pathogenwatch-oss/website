
export const SET_TABLE = 'SET_TABLE';

export function setTable(table) {
  return {
    type: SET_TABLE,
    table,
  };
}

export const SET_LABEL_COLUMN = 'SET_LABEL_COLUMN';

export function setLabelColumn(column) {
  return {
    type: SET_LABEL_COLUMN,
    column,
  };
}


export const SET_COLOUR_COLUMN = 'SET_COLOUR_COLUMN';

export function setColourColumn(column) {
  return {
    type: SET_COLOUR_COLUMN,
    column,
  };
}
