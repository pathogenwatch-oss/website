var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var rawFiles = {};
var assemblies = {};

function addFiles(newRawFiles, newAssemblies) {
  assign(rawFiles, newRawFiles);
  assign(assemblies, newAssemblies);
}

function setMetadataYear(fileAssemblyId, year) {
  assemblies[fileAssemblyId].metadata.date.year = year;
}

function setMetadataMonth(fileAssemblyId, month) {
  assemblies[fileAssemblyId].metadata.date.month = month;
}

function setMetadataDay(fileAssemblyId, day) {
  assemblies[fileAssemblyId].metadata.date.day = day;
}

function setMetadataSource(fileAssemblyId, source) {
  assemblies[fileAssemblyId].metadata.source = source;
}

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

var Store = assign({}, EventEmitter.prototype, {
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAssemblies: function () {
    return assemblies;
  },

  getAssembliesCount: function () {
    return Object.keys(assemblies).length;
  },

  getAssembly: function (fileAssemblyId) {
    return (assemblies[fileAssemblyId] || null);
  },

  getFileAssemblyIds: function () {
    return Object.keys(this.getAssemblies());
  },

  getFirstFileAssemblyId: function () {
    return this.getFileAssemblyIds()[0] || null;
  }
});

function handleAction(action) {

  switch (action.type) {

    case 'add_files':
      addFiles(action.rawFiles, action.assemblies);
      emitChange();
      break;

    case 'set_metadata_year':
      setMetadataYear(action.fileAssemblyId, action.year);
      emitChange();
      break;

    case 'set_metadata_month':
      setMetadataMonth(action.fileAssemblyId, action.month);
      emitChange();
      break;

    case 'set_metadata_day':
      setMetadataDay(action.fileAssemblyId, action.day);
      emitChange();
      break;

    case 'set_metadata_source':
      setMetadataSource(action.fileAssemblyId, action.source);
      emitChange();
      break;

    default: // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
