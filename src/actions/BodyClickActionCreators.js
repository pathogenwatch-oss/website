import AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  clicked(event) {
    AppDispatcher.dispatch({
      type: 'body_click',
      event,
    });
  },

};
