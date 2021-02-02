/* global PW_CONFIG */
/* eslint no-native-reassign: 0 */

function getConfig() {
  if ('PW_CONFIG' in global) {
    const config = Object.assign({}, PW_CONFIG);
    PW_CONFIG = undefined;
    return config;
  }
  return {};
}

export default getConfig();
