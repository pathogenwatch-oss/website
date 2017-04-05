class ServiceRequestError extends Error {
  constructor(msg) {
    super(`ServiceRequestError: ${msg}`);
  }
  static is(error) {
    return error.message.indexOf('ServiceRequestError') !== -1;
  }
}

class NotFoundError extends Error {
  constructor(msg) {
    super(`NotFoundError: ${msg}`);
  }
  static is(error) {
    return error.message.indexOf('NotFoundError') !== -1;
  }
}

module.exports = {
  ServiceRequestError,
  NotFoundError,
};
