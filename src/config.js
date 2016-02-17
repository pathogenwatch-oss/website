
const config =
  process.env.NODE_ENV === 'production' ?
    require('../config.json') :
    require('../dev.config.json');

export default config;
