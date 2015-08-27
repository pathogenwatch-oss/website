import userConfig from '../config.json';
import prodConfig from '../prod.config.json';

const config =
  process.env.NODE_ENV === 'production' ?
    prodConfig :
    userConfig;

export default config;
