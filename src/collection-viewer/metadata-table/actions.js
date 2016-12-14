export const SET_LABEL_COLUMN = 'SET_LABEL_COLUMN';

export function setLabelColumn(column) {
  return {
    type: SET_LABEL_COLUMN,
    payload: {
      column,
    },
  };
}
