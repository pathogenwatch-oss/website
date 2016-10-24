import createActionCreators from './actions';
import createReducer from './reducer';
import createSelectors from './selectors';

function createConstants(prefix) {
  return {
    UPDATE_FILTER: `${prefix.toUpperCase()}_UPDATE_FILTER`,
    CLEAR_FILTER: `${prefix.toUpperCase()}_CLEAR_FILTER`,
  };
}

export default ({ name, filters, getFilterState }) => {
  const actionTypes = createConstants(name);

  return {
    actions: createActionCreators(actionTypes),
    reducer: createReducer(actionTypes, filters),
    selectors: createSelectors(filters, getFilterState),
  };
};
