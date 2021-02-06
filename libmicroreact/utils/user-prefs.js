let updater = () => {};

function setUpdater(func) {
  updater = func;
}

function update(key, value) {
  if (typeof(updater) === 'function') {
    updater(key, value);
  }
}

export default {
  setUpdater,
  update,
};
