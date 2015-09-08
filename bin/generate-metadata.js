var fs = require('fs');

var assemblyModel = require('models/assembly');

var filePath = process.argv[2];

fs.readFile(filePath, 'utf8', function (error, file) {
  if (error) throw error;

  var lines = file.split(/(\/n+|(\/r\/n)+|(\/n\/r)+)/);
  var keys = lines[0].split(',');
  var data = lines.slice(1).map(function (line) {
    var values = line.split(',');
    return keys.reduce(function (memo, key, index) {
      memo[key] = values[index];
    }, {});
  });

  data.forEach(function (object) {
    var ids = {
      assemblyId: object.assemblyId,
      speciesId: object.speciesId
    };
    var metadata = assemblyModel.createMetadataRecord(ids, object);
    fs.writeFileSync('ASSEMBLY_METADATA_' + ids.speciesId + '_' + ids.assemblyId + '.json', JSON.stringify(metadata));
  });

  process.exit(0);
});
