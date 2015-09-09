var fs = require('fs');

var assemblyModel = require('models/assembly');

var filePath = process.argv[2];

fs.readFile(filePath, 'utf8', function (error, file) {
  if (error) throw error;

  var lines = file.split(/\r?\n/g);
  console.log('Num lines:', lines.length - 1);

  var keys = lines[0].split(',');
  console.log('Keys:', keys);

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
        assemblyId: object.original_isolate_id,
        speciesId: object.tax_id
      };
      var metadata = assemblyModel.createMetadataRecord(ids, object);
      var filename = 'ASSEMBLY_METADATA_' + ids.speciesId + '_' + ids.assemblyId + '.json';
      console.log('Writing file ' + filename);
      fs.writeFileSync(filename, JSON.stringify(metadata));
    });

  process.exit(0);
});
