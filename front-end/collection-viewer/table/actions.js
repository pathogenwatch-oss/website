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

export const SET_LABEL_COLUMN = 'SET_LABEL_COLUMN';

export function setLabelColumn(table, column) {
  return {
    type: SET_LABEL_COLUMN,
    payload: {
      table,
      column,
    },
  };
}

export const SET_COLOUR_COLUMNS = 'SET_COLOUR_COLUMNS';

export function setColourColumns(table, columns) {
  return {
    type: SET_COLOUR_COLUMNS,
    payload: {
      table,
      columns,
    },
  };
}

export const AMR_TOGGLE_MULTI = 'AMR_TOGGLE_MULTI';

export function toggleMulti() {
  return {
    type: AMR_TOGGLE_MULTI,
  };
}
