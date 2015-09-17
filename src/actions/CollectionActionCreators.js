import AppDispatcher from '../dispatcher/AppDispatcher';
import ApiUtils from '../utils/Api';
import MetadataUtils from '../utils/Metadata';

export default {

  getCollection: function (speciesId, collectionId) {
    ApiUtils.getCollection(speciesId, collectionId, function getCollection(error, collection) {
      if (error) {
        console.error('[Macroreact]', error);
        return;
      }

      ApiUtils.getReferenceCollection(speciesId, function getReferenceCollection(error, referenceCollection) {
        if (error) {
          console.error('[Macroreact]', error);
          return;
        }

        const action = {
          type: 'set_collection',
          collection: collection,
          referenceCollection: MetadataUtils.fixMetadataDateFormatInCollection(referenceCollection),
        };

        AppDispatcher.dispatch(action);
      });
    });
  },

};
