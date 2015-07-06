var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var assemblyIds = null;

function setAssemblyIds(ids) {
  assemblyIds = ids;
}

function emitChange() {
  MapStore.emit(CHANGE_EVENT);
}

var MapStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAssemblyIds: function () {
    return assemblyIds;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_assembly_ids':
      setAssemblyIds(action.assemblyIds);
      emitChange();
      break;

    default: // ... do nothing

  }
}

MapStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = MapStore;
