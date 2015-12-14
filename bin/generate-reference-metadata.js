var fs = require('fs');

var assemblyModel = require('models/assembly');

var speciesId = process.argv[2];
var filePath = process.argv[3];
var outputPath = process.argv[4];

const { ASSEMBLY_METADATA } = require('utils/documentKeys');

fs.readFile(filePath, 'utf8', function (error, file) {
  if (error) throw error;

  var lines = file.split(/\r?\n/g);
  console.log('Num lines:', lines.length - 1);

  var keys = lines[0].split(',');
  console.log('Keys:', keys);

  if (outputPath) {
    process.chdir(outputPath);
  }

  lines.slice(1).
    filter(function (line) {
      return line.length > 0;
    }).
    map(function (line) {
      var values = line.split(',');
      return keys.reduce(function (memo, key, index) {
        memo[key.toLowerCase()] = values[index];
        return memo;
      }, {});
    }).
    forEach(function (object) {
      var ids = {
        assemblyId: speciesId + '_' + object.filename,
        speciesId: speciesId
      };
      object.assemblyName = object.displayname || object.filename;
      var metadata = assemblyModel.createMetadataRecord(ids, object);
      var filename = `${ASSEMBLY_METADATA}_${ids.assemblyId}.json`;
      console.log('Writing file ' + filename);
      fs.writeFileSync(filename, JSON.stringify(metadata));
    });

  process.exit(0);
});
