
const config =
  process.env.NODE_ENV === 'production' ?
    require('../prod.config.json') :
    require('../config.json');

export default config;
