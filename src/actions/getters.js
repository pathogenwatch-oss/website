
export const SET_LABEL_GETTER = 'SET_LABEL_GETTER';

export function setLabelGetter(getter) {
  return {
    type: SET_LABEL_GETTER,
    getter,
  };
}


export const SET_COLOUR_GETTER = 'SET_COLOUR_GETTER';

export function setColourGetter(getter) {
  return {
    type: SET_COLOUR_GETTER,
    getter,
  };
}
