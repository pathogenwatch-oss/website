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

  getAssemblyNames() {
    return Object.keys(this.getAssemblies());
  },

  getFirstAssemblyName() {
    return this.getAssemblyNames()[0] || null;
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

  getMinMaxNoContigsForAllAssemblies() {
    var noContigsArray = [];
    for (var assemblyId in assemblies) {
      noContigsArray.push(assemblies[assemblyId].analysis.totalNumberOfContigs);
    }

    return [Math.min(...noContigsArray), Math.max(...noContigsArray)];
  },

  getAverageAssemblyLengthForAllAssemblies() {
    var totalAssemblyLength = 0;
    var noAssemblies = Object.keys(assemblies).length;
    for (var assemblyId in assemblies) {
      totalAssemblyLength += assemblies[assemblyId].analysis.totalNumberOfNucleotidesInDnaStrings || 0;
    }
    return Math.round(totalAssemblyLength / noAssemblies);
  }

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
