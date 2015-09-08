import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import moment from 'moment';

const CHANGE_EVENT = 'change';

const rawFiles = {};
const assemblies = {};

function addFiles(newRawFiles, newAssemblies) {
  assign(rawFiles, newRawFiles);
  assign(assemblies, newAssemblies);
}

function setMetadataDateComponent(fileAssemblyId, component, value) {
  assemblies[fileAssemblyId].metadata.date[component] = value;
}

function setMetadataColumn(fileAssemblyId, columnName, value) {
  assemblies[fileAssemblyId].metadata[columnName] = value;
  console.log(columnName, value, assemblies[fileAssemblyId].metadata);
}

function setMetadataDate(fileAssemblyId, date) {
  const m = moment(date);
  setMetadataDateComponent(fileAssemblyId, 'year', m.year());
  setMetadataDateComponent(fileAssemblyId, 'month', m.month() + 1);
  setMetadataDateComponent(fileAssemblyId, 'day', m.date());
}

function setMetadataSource(fileAssemblyId, source) {
  assemblies[fileAssemblyId].metadata.source = source;
}

function deleteAssembly(fileAssemblyId) {
  delete assemblies[fileAssemblyId];
}

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAssemblies: function () {
    return assemblies;
  },

  getAssembly: function (fileAssemblyId) {
    return (assemblies[fileAssemblyId] || null);
  },

  getAssembliesCount: function () {
    return Object.keys(assemblies).length;
  },

  getFileAssemblyIds: function () {
    return Object.keys(this.getAssemblies());
  },

  getFirstFileAssemblyId: function () {
    return this.getFileAssemblyIds()[0] || null;
  },

  getAllContigN50Data: function() {
    const n50Data = {};
    const assemblies = this.getAssemblies();
    for (const id in assemblies) {
      n50Data[id] = assemblies[id].analysis.contigN50;
    }
    return n50Data;
  },

  getAllMetadataLocations: function() {
    const locations = {};
    const assemblies = this.getAssemblies();
    for (const id in assemblies) {
      locations[id] = assemblies[id].metadata.geography;
    }
    return locations;
  },

  getLocationToAssembliesMap: function() {
    const locations = {};
    const assemblies = this.getAssemblies();
    var latlng = null;
    for (const id in assemblies) {
      // locations[id] = assemblies[id].metadata.geography;
      if (assemblies[id].metadata.geography.position.latitude != null) {
        latlng = assemblies[id].metadata.geography.position.latitude + ',' + assemblies[id].metadata.geography.position.longitude;
        if (!locations[latlng]) {
          locations[latlng] = {};
          locations[latlng]['fileAssemblyId'] = new Array();
          locations[latlng]['location'] = null;
        }
        if (assemblies[id].metadata.fileAssemblyId) {
          locations[latlng]['fileAssemblyId'].push(assemblies[id].metadata.fileAssemblyId);
        }
        if (assemblies[id].metadata.geography.location) {
          locations[latlng]['location'] = assemblies[id].metadata.geography.location;
        }
      }
    }
    return locations;
  },


});

function handleAction(action) {
  switch (action.type) {
  case 'add_files':
    addFiles(action.rawFiles, action.assemblies);
    emitChange();
    break;

  case 'set_metadata_date_component':
    setMetadataDateComponent(action.fileAssemblyId, action.component, action.value);
    emitChange();
    break;

  case 'set_metadata_column':
    setMetadataColumn(action.fileAssemblyId, action.columnName, action.value);
    emitChange();
    break;

  case 'set_metadata_date':
    setMetadataDate(action.fileAssemblyId, action.date);
    emitChange();
    break;

  case 'set_metadata_source':
    setMetadataSource(action.fileAssemblyId, action.source);
    emitChange();
    break;

  case 'delete_assembly':
    deleteAssembly(action.fileAssemblyId);
    emitChange();
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
