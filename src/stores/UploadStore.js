import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import MetadataUtils from '../utils/Metadata';

const CHANGE_EVENT = 'change';

let assemblies = {};
const errors = [];

function addFiles(newRawFiles, newAssemblies) {
  assemblies = newAssemblies;
}

function validateFiles() {
  errors.length = 0;

  const assemblyNames = Object.keys(assemblies);

  if (assemblyNames.length < 3) {
    const numberRequired = 3 - assemblyNames.length;
    errors.push({
      message: `Please upload at least ${numberRequired} more ${numberRequired === 1 ? 'assembly' : 'assemblies'} to begin.`,
    });
    return;
  }

  // if (assemblyNames.length > 100) {
  //   errors.push({
  //     message: 'Please upload no more than 100 assemblies at one time.',
  //   });
  //   return;
  // }

  for (const assemblyName of assemblyNames) {
    const assembly = assemblies[assemblyName];
    const previousNumberOfErrors = errors.length;

    assembly.hasErrors = false;

    if (!assembly.fasta || !assembly.fasta.assembly) {
      errors.push({
        message: `${assemblyName} - fasta file not provided.`,
      });
    }

    if (assembly.metadata && !MetadataUtils.isValid(assembly.metadata)) {
      errors.push({
        assemblyName,
        navigate: true,
        message: `${assemblyName} - metadata not valid.`,
      });
    }

    if (errors.length > previousNumberOfErrors) {
      assembly.hasErrors = true;
    }
  }
}

function setMetadataColumn(assemblyName, columnName, value) {
  assemblies[assemblyName].metadata[columnName] = value;
}

function setMetadataDateComponent(assemblyName, component, value) {
  assemblies[assemblyName].metadata.date[component] = value;
}

function deleteAssembly(assemblyName) {
  delete assemblies[assemblyName];
  assemblies = assign({}, assemblies);
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
      const metrics = assemblies[id].metrics || {};
      if (metrics[chartType]) {
        memo[id] = metrics[chartType];
      }
      return memo;
    }, {});
  },

  getMinMaxNoContigsForAllAssemblies() {
    const contigsRange = {};

    for (const assemblyId of Object.keys(assemblies)) {
      const { totalNumberOfContigs } = assemblies[assemblyId].metrics || {};
      if (totalNumberOfContigs) {
        contigsRange.min = contigsRange.min ?
          Math.min(contigsRange.min, totalNumberOfContigs) :
          totalNumberOfContigs;
        contigsRange.max = contigsRange.max ?
          Math.max(contigsRange.max, totalNumberOfContigs) :
          totalNumberOfContigs;
      }
    }

    return contigsRange;
  },

  getAverageAssemblyLength() {
    var totalAssemblyLength = 0;
    var noAssemblies = Object.keys(assemblies).length;
    for (var assemblyId in assemblies) {
      const metrics = assemblies[assemblyId].metrics || {};
      totalAssemblyLength += (metrics.totalNumberOfNucleotidesInDnaStrings || 0);
    }
    return Math.round(totalAssemblyLength / noAssemblies);
  },

  isReadyToUpload() {
    return errors.length === 0;
  },

  getErrors() {
    return errors;
  },

  clearStore() {
    assemblies = {};
  },
});

function emitChange() {
  validateFiles();
  Store.emit(CHANGE_EVENT);
}

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

  case 'delete_assembly':
    deleteAssembly(action.assemblyName);
    emitChange();
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

export default Store;
