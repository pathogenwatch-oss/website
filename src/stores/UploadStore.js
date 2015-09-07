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

function setMetadataYear(fileAssemblyId, year) {
  assemblies[fileAssemblyId].metadata.date.year = year;
}

function setMetadataMonth(fileAssemblyId, month) {
  assemblies[fileAssemblyId].metadata.date.month = month;
}

function setMetadataDay(fileAssemblyId, day) {
  assemblies[fileAssemblyId].metadata.date.day = day;
}

function setMetadataColumn(fileAssemblyId, columnName, value) {
  assemblies[fileAssemblyId].metadata[columnName] = value;
  console.log(columnName, value, assemblies[fileAssemblyId].metadata);
}

function setMetadataDate(fileAssemblyId, date) {
  var m = moment(date);
  setMetadataYear(fileAssemblyId, m.year());
  setMetadataMonth(fileAssemblyId, m.month() + 1);
  setMetadataDay(fileAssemblyId, m.date());
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

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
