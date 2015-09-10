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

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAssemblies() {
    return assemblies;
  },

  getAssembly(fileAssemblyId) {
    return (assemblies[fileAssemblyId] || null);
  },

  getAssembliesCount() {
    return Object.keys(assemblies).length;
  },

  getFileAssemblyIds() {
    return Object.keys(this.getAssemblies());
  },

  getFirstFileAssemblyId() {
    return this.getFileAssemblyIds()[0] || null;
  },

  getOverviewChartData(chartType) {
    return Object.keys(assemblies).reduce((memo, id) => {
      if (assemblies[id].analysis[chartType]) {
        memo[id] = assemblies[id].analysis[chartType];
      }
      return memo;
    }, {});
  },

  getAllMetadataLocations() {
    return Object.keys(assemblies).reduce((memo, id) => {
      memo[id] = assemblies[id].metadata.geography;
      return memo;
    }, {});
  },

  getLocationToAssembliesMap() {
    return Object.keys(assemblies).reduce((memo, id) => {
      const { assemblyName, geography } =  assemblies[id].metadata;
      if (geography.position.latitude !== null) {
        const latlng =
          geography.position.latitude + ',' + geography.position.longitude;
        if (!memo[latlng]) {
          memo[latlng] = {
            assemblyName: [],
            location: null,
          };
        }
        if (assemblyName) {
          memo[latlng].assemblyName.push(assemblyName);
        }
        if (geography.location) {
          memo[latlng].location = geography.location;
        }
      }
      return memo;
    }, {});
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
