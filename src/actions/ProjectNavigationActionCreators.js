var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setProjectNavigation: function (projectNavigation) {
    var action = {
      type: 'set_project_navigation',
      projectNavigation: projectNavigation
    };

    AppDispatcher.dispatch(action);
  }

};
