var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var numberOfExpectedResults = null;
var receivedResults = {};
var receivedAssemblyResults = {
  assemblies: null,
  collection: null
};

function setNumberOfExpectedResults(number) {
  numberOfExpectedResults = number;
}

function setReceivedResult(result) {
  var resultString = result.assemblyId + '__' + result.result;

  receivedResults[resultString] = true;

  if (result.assemblyId) {
    receivedAssemblyResults.assemblies = receivedAssemblyResults.assemblies || {};
    receivedAssemblyResults.assemblies[result.assemblyId] = receivedAssemblyResults.assemblies[result.assemblyId] || {};
    receivedAssemblyResults.assemblies[result.assemblyId][result.result] = true;

    console.log('[Macroreact][Assembly Result] ' + result.assemblyId + ' ' + result.result);
    console.dir(receivedAssemblyResults);

    return;
  }

  receivedAssemblyResults.collection = receivedAssemblyResults.collection || {};
  receivedAssemblyResults.collection[result.result] = true;

  console.log('[Macroreact][Collection Result] ' + result.collectionId + ' ' + result.result);
  console.dir(receivedAssemblyResults);
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

  getNumberOfExpectedResults: function () {
    return numberOfExpectedResults;
  },

  getNumberOfReceivedResults: function () {
    return Object.keys(receivedResults).length;
  },

  getProgressPercentage: function () {
    return Math.floor(this.getNumberOfReceivedResults() * 100 / this.getNumberOfExpectedResults());
  },

  getReceivedAssemblyResults: function () {
    return receivedAssemblyResults;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_number_of_expected_results':
      setNumberOfExpectedResults(action.numberOfExpectedResults);
      emitChange();
      break;

    case 'add_received_result':
      setReceivedResult(action.result);
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
