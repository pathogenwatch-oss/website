import React from 'react';
import { connect } from 'react-redux';

import Explorer from './Explorer.react';
import { HeaderContent } from './layout/LayoutContainer.react';

import FileUploadingStore from '^/stores/FileUploadingStore';

import { setCollectionId } from '^/actions/collection';
import { checkStatus, fetchEntities, updateProgress } from '^/actions/fetch';
import { resetStore } from '^/actions/reset';

import Species from '^/species';

const connectExplorer = connect(
  ({ collection }) => {
    return {
      status: collection.status,
      progress: collection.progress,
      cas: collection.cas,
    };
  },
  null,
  ({ status, progress, cas }, { dispatch }, { id }) => {
    return {
      status,
      progress,
      cas,
      initialise() {
        dispatch(setCollectionId(id));
        // if uploading, initial status check not necessary
        if (!FileUploadingStore.isUploading()) {
          dispatch(checkStatus(Species.id, id));
        }
      },
      checkStatus: () => dispatch(checkStatus(Species.id, id, cas)),
      updateProgress: results => dispatch(updateProgress(results)),
      fetch: () => dispatch(fetchEntities(Species.id, id)),
      reset: () => dispatch(resetStore()),
    };
  },
);

export const headerProps = {
  className: 'mdl-layout__header--primary mdl-shadow--3dp',
  content: (<HeaderContent />),
};

export default function ({ params }) {
  const ReduxExplorer = connectExplorer(Explorer);

  return (
    <ReduxExplorer id={params.id} />
  );
}
