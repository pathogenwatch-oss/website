class ServiceRequestError extends Error {

  constructor(msg) {
    super(`ServiceRequestError: ${msg}`);
  }

  static is(error) {
    return error.message.indexOf('ServiceRequestError') !== -1;
  }

}

module.exports = {
  ServiceRequestError,
};
