import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";

import reducer from "microreact-viewer/src/reducers";
import delayDispatchMiddleware from "microreact-viewer/src/utils/store-middleware";

const store = compose(
  applyMiddleware(thunk, delayDispatchMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
)(createStore)(reducer);

export default store;
