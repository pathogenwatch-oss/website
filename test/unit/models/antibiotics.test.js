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

  it('should return a flattened structure for the front end', function () {
    var antibioticModel = rewire('models/antibiotic');
    var antibiotics = {
      class1: {
        name1: { 'antibioticClass': 'class1', 'antibioticName': 'name1' },
        name2: { 'antibioticClass': 'class1', 'antibioticName': 'name2' }
      },
      class2: {
        name3: { 'antibioticClass': 'class2', 'antibioticName': 'name3' }
      }
    };
    var mockMainStorage = {
      retrieve: sinon.stub().yields(null, { antibiotics: antibiotics })
    };
    var reset = antibioticModel.__set__('mainStorage', mockMainStorage);

    antibioticModel.get('1280', function (_, flattenedResult) {
      assert('name1' in flattenedResult);
      assert('name2' in flattenedResult);
      assert('name3' in flattenedResult);

      assert.equal(flattenedResult.name1, 'class1');
      assert.equal(flattenedResult.name2, 'class1');
      assert.equal(flattenedResult.name3, 'class2');

      reset();
    });
  });

});
