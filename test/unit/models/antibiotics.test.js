const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');

describe.only('Model: Antibiotics', () => {

  it('should request antibiotics for the specified species id', () => {
    const antibioticModel = rewire('models/antibiotic');
    const mockMainStorage = {
      retrieve: sinon.stub(),
    };
    const reset = antibioticModel.__set__('mainStorage', mockMainStorage);
    const { ANTIMICROBIALS } = require('utils/documentKeys');

    antibioticModel.get('1280');

    assert(mockMainStorage.retrieve.calledWith(`${ANTIMICROBIALS}_1280`));

    reset();
  });

  it('should return a sorted array for the front end', () => {
    const antibioticModel = rewire('models/antibiotic');
    const antibiotics = {
      class1: {
        name1: {
          antibioticClass: 'class1',
          antibioticName: 'name1',
          altName: 'altName1',
        },
      },
      class2: {
        name2: {
          antibioticClass: 'class2',
          antibioticName: 'name2',
          altName: 'altName2',
        },
        name3: {
          antibioticClass: 'class2',
          antibioticName: 'name3',
          altName: 'altName3',
        },
      },
    };
    const mockMainStorage = {
      retrieve: sinon.stub().yields(null, { antibiotics }),
    };
    const reset = antibioticModel.__set__('mainStorage', mockMainStorage);

    antibioticModel.get('1280', (_, [ ab1, ab2, ab3 ]) => {
      assert.equal(ab1.name, 'name1');
      assert.equal(ab1.longName, 'altName1');
      assert.equal(ab2.name, 'name2');
      assert.equal(ab2.longName, 'altName2');
      assert.equal(ab3.name, 'name3');
      assert.equal(ab3.longName, 'altName3');
      reset();
    });
  });

});
