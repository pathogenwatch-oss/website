import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import moment from 'moment';
import ToastActionCreators from '../actions/ToastActionCreators';

const CHANGE_EVENT = 'change';

const rawFiles = {};
const assemblies = {};
let readyToUpload = false;
let errors = {};

function addFiles(newRawFiles, newAssemblies) {
  assign(rawFiles, newRawFiles);
  assign(assemblies, newAssemblies);
}

function setMetadataDateComponent(assemblyName, component, value) {
  assemblies[assemblyName].metadata.date[component] = value;
}

function setMetadataColumn(assemblyName, columnName, value) {
  assemblies[assemblyName].metadata[columnName] = value;
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
      const { geography } = assemblies[id].metadata;
      const filename = assemblies[id].fasta.name;
      if (geography.position.latitude !== null) {
        const latlng =
          geography.position.latitude + ',' + geography.position.longitude;
        if (!memo[latlng]) {
          memo[latlng] = {
            assemblyName: [],
            location: null,
          };
        }
        if (filename) {
          memo[latlng].assemblyName.push(filename);
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
      if (assemblies[assemblyId].analysis.totalNumberOfContigs) {
        noContigsArray.push(assemblies[assemblyId].analysis.totalNumberOfContigs);
      }
    }
    if (noContigsArray.length <= 0) {
      return [0, 0];
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
  },

  validateMetadata() {
    var isValidMap = {};
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    readyToUpload = true;

    for (var id in assemblies) {
      if (!assemblies[id].fasta.assembly) {
        isValidMap[id] = false;
        readyToUpload = false;
      }
      else if (assemblies[id].metadata.date.day && !(assemblies[id].metadata.date.day >= 1 && assemblies[id].metadata.date.day <= 31) ||
               assemblies[id].metadata.date.month && !(assemblies[id].metadata.date.month >= 1 && assemblies[id].metadata.date.month <= 12) ||
               assemblies[id].metadata.date.year && !(assemblies[id].metadata.date.year > 1900 && assemblies[id].metadata.date.year <= year)) {
        isValidMap[id] = false;
        readyToUpload = false;
      }
      else {
        isValidMap[id] = true;
      }
    }
    return isValidMap;
  },

  isReadyToUpload() {
    return readyToUpload;
  },

  hasError() {
    errors = [];
    for (var id in assemblies) {
      // console.log()
      if (!assemblies[id].fasta.assembly) {
        errors.push({
          'id': id,
          'message': 'Assembly missing'
        })
        break;
      }
      else if (assemblies[id].metadata.date.day && !(assemblies[id].metadata.date.day >= 1 && assemblies[id].metadata.date.day <= 31) ||
               assemblies[id].metadata.date.month && !(assemblies[id].metadata.date.month >= 1 && assemblies[id].metadata.date.month <= 12) ||
               assemblies[id].metadata.date.year && !(assemblies[id].metadata.date.year > 1900 && assemblies[id].metadata.date.year <= year)) {
        errors.push({
          'id': id,
          'message': 'Please review metadata'
        })
        break;
      }
    }

    const totalAssemblies = this.getAssembliesCount();
    if (totalAssemblies < 3 || totalAssemblies > 100) {
      if (totalAssemblies > 100) {
        errors.push({
          'message': 'Maximum upload limit is set to 100'
        })
      }
    }

    return errors;
  },

  warn(message) {
    var toast = {
      message: message,
      type: 'warn',
      sticky: true
    };

    ToastActionCreators.fireToast(toast);

        // if(!assemblies[id].fasta.assembly) {
        //   var toast = {
        //     message: 'Assembly missing for ' + id,
        //     type: 'warn',
        //     sticky: true
        //   };
        //   // ToastActionCreators.fireToast(toast);
        // }
        // else {
        //   var toast = {
        //     message: 'Please review the metadata for ' + id,
        //     type: 'warn',
        //     sticky: true
        //   };

        //   // ToastActionCreators.fireToast(toast);
        // }

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
