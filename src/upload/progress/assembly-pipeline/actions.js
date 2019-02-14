export function updateAssemblyStatus(data) {
  return {
    type: 'ASSEMBLY_PIPELINE_STATUS',
    payload: data.tasks,
  };
}
