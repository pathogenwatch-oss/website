export const getInstructions = ({ upload }) => upload.instructions;

export const getSettingValue = (state, setting) =>
  getInstructions(state)[setting];

export const getAssemblerUsage = state => getInstructions(state).assemblerUsage;
