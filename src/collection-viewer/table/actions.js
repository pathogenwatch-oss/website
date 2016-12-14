export const SET_TABLE = 'SET_TABLE';

export function setTable(name) {
  return {
    type: SET_TABLE,
    payload: {
      name,
    },
  };
}

export const SHOW_TABLE_VIEW = 'SHOW_TABLE_VIEW';

export function showTableView(view) {
  return {
    type: SHOW_TABLE_VIEW,
    payload: {
      view,
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
