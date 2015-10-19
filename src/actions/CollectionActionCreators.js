import AppDispatcher from '../dispatcher/AppDispatcher';
import ApiUtils from '../utils/Api';
import MetadataUtils from '../utils/Metadata';

const collectionErrorAction = {
  type: 'collection_error',
};

export default {

  getCollection(speciesId, collectionId) {
    const action = {
      type: 'set_collection',
      collection: null,
      referenceCollection: null,
    };

    ApiUtils.getCollection(speciesId, collectionId, function (error, collection) {
      if (error) {
        console.error('[WGSA]', error);
        return AppDispatcher.dispatch(collectionErrorAction);
      }

      action.collection = collection;

      if (action.collection && action.referenceCollection) {
        AppDispatcher.dispatch(action);
      }
    });

    ApiUtils.getReferenceCollection(speciesId, function (error, referenceCollection) {
      if (error) {
        console.error('[WGSA]', error);
        return AppDispatcher.dispatch(collectionErrorAction);
      }

      MetadataUtils.fixMetadataDateFormatInCollection(referenceCollection);
      action.referenceCollection = referenceCollection;

      if (action.collection && action.referenceCollection) {
        AppDispatcher.dispatch(action);
      }
    });
  },

};
