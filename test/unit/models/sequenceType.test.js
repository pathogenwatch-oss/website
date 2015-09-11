var assert = require('assert');
var rewire = require('rewire');

describe('Model: Sequence Type', function () {

  it('should generate a query key',
    function () {
      /**
       * Temporarily testing private functions until a "query builder" pattern
       * has been established
       */
      var generateStQueryKey =
        rewire('models/sequenceType').__get__('generateStQueryKey');

      var sequenceType = '1280';
      var alleles = {
        one: { alleleId: 1 },
        two: { alleleId: 2 },
        three: { alleleId: 3 }
      };

      var stQueryKey = generateStQueryKey(sequenceType, alleles);
      assert.equal(stQueryKey, 'ST_1280_1_2_3');
    }
  );

  it('should not generate a query key for alleles with missing ids',
    function () {
      var generateStQueryKey =
        rewire('models/sequenceType').__get__('generateStQueryKey');

      var alleles = {
        one: { alleleId: 1 },
        two: { alleleId: undefined },
        three: { alleleId: 3 }
      };

      var stQueryKey = generateStQueryKey('1280', alleles);
      assert.equal(stQueryKey, null);
    }
  );

});
