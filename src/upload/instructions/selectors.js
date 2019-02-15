export const getInstructions = ({ upload }) => upload.instructions;

export const getSettingValue = (state, setting) =>
  getInstructions(state)[setting];

export const getAssemblyLimits = state => getInstructions(state).assemblyLimits;
