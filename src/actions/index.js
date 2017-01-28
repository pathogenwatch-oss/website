const asyncStages = [ 'ATTEMPT', 'SUCCESS', 'FAILURE' ];

export function createAsyncConstants(actionType) {
  return asyncStages.reduce((constants, stage) => ({
    ...constants,
    [stage]: `${actionType}::${stage}`,
  }), {});
}
