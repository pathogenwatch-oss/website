export const ASSEMBLY_PROGRESS_TICK = 'ASSEMBLY_PROGRESS_TICK';

export function assemblyProgressTick() {
  return {
    type: ASSEMBLY_PROGRESS_TICK,
  };
}

export const ASSEMBLY_PIPELINE_STATUS = 'ASSEMBLY_PIPELINE_STATUS';

export function assemblyPipelineStatus(update) {
  return {
    type: ASSEMBLY_PIPELINE_STATUS,
    payload: update,
  };
}
