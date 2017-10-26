const initialState = {
  visible: false,
  message: null,
  action: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case 'TOAST_SHOW':
      return {
        visible: true,
        ...payload,
      };
    case 'TOAST_HIDE':
      return initialState;
    default:
      return state;
  }
}
