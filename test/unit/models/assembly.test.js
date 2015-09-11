var assert = require('assert');

describe('Model: Assembly', function () {

  it('should map assembly IDs to taxa', function () {
    var assemblyModel = require('models/assembly');
    var assemblies = {
      assembly1: { populationSubtype: 'taxon1' },
      assembly2: { populationSubtype: 'taxon2' }
    };
    var taxonToAssemblyMap = assemblyModel.mapTaxaToAssemblies(assemblies);
    assert.equal(taxonToAssemblyMap.taxon1.assemblyIds[0], 'assembly1');
    assert.equal(taxonToAssemblyMap.taxon2.assemblyIds[0], 'assembly2');
  });

});
