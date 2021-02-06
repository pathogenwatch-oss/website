const config = {
  isAuthenticated: false,
  user: null,
  strategies: [],
  ...window.Microreact,
};

export function update(updater) {
  Object.assign(config, updater);
}

export default config;
