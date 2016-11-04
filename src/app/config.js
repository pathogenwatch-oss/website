/* global WGSA_CONFIG */
/* eslint no-native-reassign: 0 */

function getConfig() {
  if ('WGSA_CONFIG' in global) {
    const config = Object.assign({}, WGSA_CONFIG);
    WGSA_CONFIG = undefined;
    return config;
  }
  return {};
}

export default getConfig();
