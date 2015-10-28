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

      var mlst = {
        code: '1_2_3',
        alleles: {
          one: { alleleId: 1 },
          two: { alleleId: 2 },
          three: { alleleId: 3 }
        }
      };

      var stQueryKey = generateStQueryKey('1280', mlst);
      assert.equal(stQueryKey, 'ST_1280_1_2_3');
    }
  );

  it('should not generate a query key for alleles with missing ids',
    function () {
      var generateStQueryKey =
        rewire('models/sequenceType').__get__('generateStQueryKey');

      var mlst = {
        code: '1_3',
        alleles: {
          one: { alleleId: 1 },
          two: { alleleId: undefined },
          three: { alleleId: 3 }
        }
      };

      var stQueryKey = generateStQueryKey('1280', mlst);
      assert.equal(stQueryKey, null);
    }
  );

  it('should handle null alleles', function (done) {
    var sequenceTypeModel = rewire('models/sequenceType');

    var assembly = {
      MLST_RESULT: {
        alleles: {
          arcc: null,
          aroe: null,
          glpf: null,
          gmk_: null,
          pta_: null,
          tpi_: null,
          yqil: null
        },
        stCode: 'Not determined'
      }
    };

    sequenceTypeModel.addSequenceTypeData(assembly, '1234', function (_, result) {
      assert.equal(result.sequenceType, assembly.stCode);
      done();
    });

  });

});
