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

function setMetadataDateComponent(assemblyName, component, value) {
  assemblies[assemblyName].metadata.date[component] = value;
}

function setMetadataColumn(assemblyName, columnName, value) {
  assemblies[assemblyName].metadata[columnName] = value;
  console.log(columnName, value, assemblies[assemblyName].metadata);
}

function setMetadataDate(assemblyName, date) {
  const m = moment(date);
  setMetadataDateComponent(assemblyName, 'year', m.year());
  setMetadataDateComponent(assemblyName, 'month', m.month() + 1);
  setMetadataDateComponent(assemblyName, 'day', m.date());
}

function setMetadataSource(assemblyName, source) {
  assemblies[assemblyName].metadata.source = source;
}

function deleteAssembly(assemblyName) {
  delete assemblies[assemblyName];
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

  getAssembly: function (assemblyName) {
    return (assemblies[assemblyName] || null);
  },

  getAssembliesCount: function () {
    return Object.keys(assemblies).length;
  },

  getAssemblyNames: function () {
    return Object.keys(this.getAssemblies());
  },

  getFirstassemblyName: function () {
    return this.getAssemblyNames()[0] || null;
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
          locations[latlng]['assemblyName'] = new Array();
          locations[latlng]['location'] = null;
        }
        if (assemblies[id].metadata.assemblyName) {
          locations[latlng]['assemblyName'].push(assemblies[id].metadata.assemblyName);
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
    setMetadataDateComponent(action.assemblyName, action.component, action.value);
    emitChange();
    break;

  case 'set_metadata_column':
    setMetadataColumn(action.assemblyName, action.columnName, action.value);
    emitChange();
    break;

  case 'set_metadata_date':
    setMetadataDate(action.assemblyName, action.date);
    emitChange();
    break;

  case 'set_metadata_source':
    setMetadataSource(action.assemblyName, action.source);
    emitChange();
    break;

  case 'delete_assembly':
    deleteAssembly(action.assemblyName);
    emitChange();
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
