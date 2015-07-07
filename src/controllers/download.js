var assemblyModel = require('models/assembly');

var LOGGER = require('utils/logging').createLogger('download');

var flattenAssemblyMetadata = function (assemblyMetadata) {
  assemblyMetadata.location = assemblyMetadata.geography.address;
  assemblyMetadata.latitude = assemblyMetadata.geography.position.latitude;
  assemblyMetadata.longitude = assemblyMetadata.geography.position.longitude;
  delete assemblyMetadata.geography;

  return assemblyMetadata;
};

var convertJsonToCsv = function (flatJson) {
  var BabyParse = require('babyparse');

  return BabyParse.unparse({
    fields: [
      'assemblyId',
      'userAssemblyId',
      'datetime',
      'location',
      'latitude',
      'longitude',
      'source'
    ],
    data: [flatJson]
  });
};

function downloadAssemblyMetadata(req, res, next) {
  var assemblyId = req.params.id;
  var metadataFormat = req.params.format;

  LOGGER.info(
    'Getting assembly ' + assemblyId + ' metadata for download in ' +
      metadataFormat + ' format'
  );

  assemblyModel.getMetadata(assemblyId,
    function (error, assemblyMetadata) {
      if (error) {
        return next(error);
      }

      if (metadataFormat === 'csv') {
        LOGGER.info('Returning CSV file');

        var flatAssemblyMetadata = flattenAssemblyMetadata(assemblyMetadata);
        var assemblyMetadataCsv = convertJsonToCsv(flatAssemblyMetadata);

        res.setHeader(
          'Content-disposition',
          'attachment; filename=assembly_metadata_' + assemblyId + '.csv'
        );
        res.send(assemblyMetadataCsv);

      } else {
        LOGGER.info('Returning JSON file');

        res.setHeader(
          'Content-disposition',
          'attachment; filename=assembly_metadata_' + assemblyId + '.json'
        );
        res.send(JSON.stringify(assemblyMetadata, null, 4));
      }
    }
  );
}

module.exports.downloadAssemblyMetadata = downloadAssemblyMetadata;
