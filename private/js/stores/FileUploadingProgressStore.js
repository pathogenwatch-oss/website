var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var numberOfExpectedResults = null;
var receivedResults = {};

function setNumberOfExpectedResults(number) {
  numberOfExpectedResults = number;
}

function setReceivedResult(result) {
  receivedResults[result] = true;
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
