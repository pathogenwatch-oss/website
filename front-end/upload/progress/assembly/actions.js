export const ASSEMBLY_PROGRESS_TICK = 'ASSEMBLY_PROGRESS_TICK';

export function assemblyProgressTick() {
  return {
    type: ASSEMBLY_PROGRESS_TICK,
    payload: Date.now(),
  };
}

export const ASSEMBLY_PIPELINE_STATUS = 'ASSEMBLY_PIPELINE_STATUS';

export function assemblyPipelineStatus(update) {
  return {
    type: ASSEMBLY_PIPELINE_STATUS,
    payload: update,
  };
}

export const ASSEMBLY_PIPELINE_ERROR = 'ASSEMBLY_PIPELINE_ERROR';

export function assemblyPipelineError(error) {
  return {
    type: ASSEMBLY_PIPELINE_ERROR,
    payload: error,
  };
}
