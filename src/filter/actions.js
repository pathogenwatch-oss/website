export default actionTypes => ({
  updateFilter(key, value) {
    return {
      type: actionTypes.UPDATE_FILTER,
      payload: {
        key, value,
      },
    };
  },
  clearFilter() {
    return {
      type: actionTypes.CLEAR_FILTER,
    };
  },
});
