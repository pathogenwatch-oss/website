const errorTypes = {
  serviceRequestError: Symbol('serviceRequestError'),
  serviceRequestErrorJSON: Symbol('serviceRequestErrorJSON'),
  notFoundError: Symbol('notFoundError'),
};

class ServiceRequestError extends Error {
  constructor(msg) {
    super(`ServiceRequestError: ${msg}`);
    this.wgsaType = errorTypes.serviceRequestError;
  }
  static is(error) {
    return error.wgsaType === errorTypes.serviceRequestError;
  }
}

class ServiceRequestErrorJSON extends Error {
  constructor(msg, data) {
    super(msg);
    this.wgsaType = errorTypes.serviceRequestErrorJSON;
    this.data = data;
    this.format = this.format.bind(this);
  }
  static is(error) {
    return error.wgsaType === errorTypes.serviceRequestErrorJSON;
  }
  format() {
    return { ...this.data, message: this.message };
  }
}

class NotFoundError extends Error {
  constructor(msg) {
    super(`NotFoundError: ${msg}`);
    this.wgsaType = errorTypes.notFoundError;
  }
  static is(error) {
    return error.wgsaType === errorTypes.notFoundError;
  }
}

module.exports = {
  ServiceRequestError,
  ServiceRequestErrorJSON,
  NotFoundError,
};
