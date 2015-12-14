var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('Model: Antibiotics', function () {

  it('should request antibiotics for the specified species id', function () {
    var antibioticModel = rewire('models/antibiotic');
    var mockMainStorage = {
      retrieve: sinon.stub()
    };
    var reset = antibioticModel.__set__('mainStorage', mockMainStorage);
    const { ANTIBIOTICS_LIST } = require('utils/documentKeys');

    antibioticModel.get('1280');

    assert(mockMainStorage.retrieve.calledWith(`${ANTIBIOTICS_LIST}_1280`));

    reset();
  });

  it.only('should return a sorted array for the front end', function () {
    var antibioticModel = rewire('models/antibiotic');
    var antibiotics = {
      class1: {
        name1: { 'antibioticClass': 'class1', 'antibioticName': 'name1' },
      },
      class2: {
        name3: { 'antibioticClass': 'class2', 'antibioticName': 'name3' },
        name2: { 'antibioticClass': 'class2', 'antibioticName': 'name2' }
      }
    };
    var mockMainStorage = {
      retrieve: sinon.stub().yields(null, { antibiotics: antibiotics })
    };
    var reset = antibioticModel.__set__('mainStorage', mockMainStorage);

    antibioticModel.get('1280', function (_, array) {
      assert(array[0] === 'name1');
      assert(array[1] === 'name2');
      assert(array[2] === 'name3');

      reset();
    });
  });

});
