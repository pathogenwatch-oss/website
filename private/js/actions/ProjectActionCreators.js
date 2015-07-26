var AppDispatcher = require('../dispatcher/AppDispatcher');
var ApiUtils = require('../utils/Api');
var MetadataUtils = require('../utils/Metadata');

module.exports = {

  getProject: function (collectionId) {
    ApiUtils.getProject(collectionId, function getProject(error, collection) {
      if (error) {
        console.error('[Macroreact] ' + error);
        return;
      }

      ApiUtils.getReferenceProject(function getReferenceProject(error, referenceCollection) {
        if (error) {
          console.error('[Macroreact] ' + error);
          return;
        }

        var action = {
          type: 'set_collection',
          collection: collection,
          referenceCollection: MetadataUtils.fixMetadataDateFormatInCollection(referenceCollection)
        };

        AppDispatcher.dispatch(action);
      });
    });
  }
};
