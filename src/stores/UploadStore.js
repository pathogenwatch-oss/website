import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import MetadataUtils from '../utils/Metadata';
import Species from '^/species';
import CONFIG from '../config';

const MAX_COLLECTION_SIZE = parseInt(CONFIG.maxCollectionSize || '0', 10);

const CHANGE_EVENT = 'change';

let assemblies = {};
const errors = [];

function addFiles(newRawFiles, newAssemblies) {
  assemblies = newAssemblies;
}

function validateFiles() {
  errors.length = 0;

  const assemblyNames = Object.keys(assemblies);

  if (Store.isCollectionTooLarge()) {
    errors.push({
      message: `Please upload no more than ${CONFIG.maxCollectionSize} assemblies at one time.`,
    });
  }

  // create a new array to propagate error changes - temporary hack...
  assemblies = assemblyNames.reduce((memo, assemblyName) => {
    const assembly = assemblies[assemblyName];
    const previousNumberOfErrors = errors.length;

    assembly.hasErrors = false;

    if (!assembly.fasta || !assembly.fasta.assembly) {
      errors.push({
        message: (<span><strong>{assemblyName}</strong> - fasta file not provided.</span>),
      });
    }

    if (assembly.metadata && !MetadataUtils.isValid(assembly.metadata)) {
      errors.push({
        assemblyName,
        navigate: true,
        message: (<span><strong>{assemblyName}</strong> - metadata not valid.</span>),
      });
    }

    const assemblySize =
      assembly.metrics && assembly.metrics.totalNumberOfNucleotidesInDnaStrings;
    if (assemblySize > Species.maxAssemblySize) {
      errors.push({
        assemblyName,
        navigate: true,
        message: (<span><strong>{assemblyName}</strong> - assembly too large. Please ensure it is {Species.current.formattedShortName}.</span>),
      });
    }

    if (errors.length > previousNumberOfErrors) {
      assembly.hasErrors = true;
    }

    memo[assemblyName] = assembly;
    return memo;
  }, {});
}

function setMetadataColumn(assemblyName, columnName, value) {
  const { metadata = {} } = assemblies[assemblyName];

  if (typeof value === 'string' && value.length) {
    metadata[columnName] = value;
  } else {
    delete metadata[columnName];
  }

  assemblies[assemblyName].metadata = metadata;
}

function setMetadataDateComponent(assemblyName, component, value) {
  const { metadata = { date: {} } } = assemblies[assemblyName];
  metadata.date[component] = value;
  assemblies[assemblyName].metadata = metadata;
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

  isCollectionTooLarge() {
    const count = this.getAssembliesCount();
    return MAX_COLLECTION_SIZE && count > MAX_COLLECTION_SIZE;
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
      if (metrics[chartType] !== undefined) {
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
    return this.getAssembliesCount() > 0 && errors.length === 0;
  },

  getErrors() {
    return errors;
  },

  clearStore() {
    assemblies = {};
    errors.length = 0;
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
