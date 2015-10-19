import userConfig from '../config.json';

const config = process.env.NODE_ENV === 'production' ? {} : userConfig;

export default config;
