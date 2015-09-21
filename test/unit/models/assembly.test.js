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

  it('should add user-defined metadata', function () {
    var assemblyModel = require('models/assembly');
    var ids = { assemblyId: '123', speciesId: '1280' };
    var rawMetadata = {
      assemblyName: 'name',
      year: 2015,
      month: 9,
      day: 12,
      latitude: 42,
      longitude: 42,
      location: 'sanger',
      col1: 'val1',
      col2: 'val2',
      col3: 'val3'
    };

    var parsedMetadata = assemblyModel.createMetadataRecord(ids, rawMetadata);
    console.dir(parsedMetadata);
    assert.equal(parsedMetadata.userDefined.col1, rawMetadata.col1);
    assert.equal(parsedMetadata.userDefined.col2, rawMetadata.col2);
    assert.equal(parsedMetadata.userDefined.col3, rawMetadata.col3);
  });

});
