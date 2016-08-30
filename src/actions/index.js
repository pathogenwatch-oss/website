const asyncStages = [ 'ATTEMPT', 'SUCCESS', 'FAILURE' ];

export function createAsyncConstants(actionType) {
  return asyncStages.reduce((constants, stage) => ({
    ...constants,
    [stage]: `${actionType}::${stage}`,
  }), {});
}

/* Upload View */

/* File */
export const START_PROCESSING_FILES = 'START_PROCESSING_FILES';
export const FINISH_PROCESSING_FILES = 'FINISH_PROCESSING_FILES';
export const ADD_FILES = 'ADD_FILES';

/* Metadata */
export const SET_METADATA_DATE_COMPONENT = 'SET_METADATA_DATE_COMPONENT';
export const SET_METADATA_COLUMN = 'SET_METADATA_COLUMN';

/* Upload */
export const SET_COLLECTION_ID = 'SET_COLLECTION_ID';
export const START_UPLOADING_FILES = 'START_UPLOADING_FILES';
export const FINISH_UPLOADING_FILES = 'FINISH_UPLOADING_FILES';

/* Upload Progress */
export const SET_NUMBER_OF_EXPECTED_RESULTS = 'SET_NUMBER_OF_EXPECTED_RESULTS';
export const SET_ASSEMBLY_PROGRESS = 'SET_ASSEMBLY_PROGRESS';
export const SET_RECEIVED_RESULT = 'SET_RECEIVED_RESULT';


/* Explorer View */

/* Filter */
export const SET_LABEL_COLUMN = 'SET_LABEL_COLUMN';
export const SET_COLOUR_COLUMNS = 'SET_COLOUR_COLUMNS';


/* Download */
export const REQUEST_FILE = 'REQUEST_FILE';

/* Toast */
export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
