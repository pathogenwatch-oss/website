const errorTypes = {
  serviceRequestError: Symbol('serviceRequestError'),
  serviceRequestErrorJSON: Symbol('serviceRequestErrorJSON'),
  notFoundError: Symbol('notFoundError'),
};

class ServiceRequestError extends Error {
  constructor(msg) {
    super(`ServiceRequestError: ${msg}`);
    this.pwType = errorTypes.serviceRequestError;
  }
  static is(error) {
    return error.pwType === errorTypes.serviceRequestError;
  }
}

class ServiceRequestErrorJSON extends Error {
  constructor(msg, data) {
    super(msg);
    this.pwType = errorTypes.serviceRequestErrorJSON;
    this.data = data;
    this.format = this.format.bind(this); // because of seneca serialisation, I think
  }
  static is(error) {
    return error.pwType === errorTypes.serviceRequestErrorJSON;
  }
  format() {
    return { ...this.data, message: this.message };
  }
}

class NotFoundError extends Error {
  constructor(msg) {
    super(`NotFoundError: ${msg}`);
    this.pwType = errorTypes.notFoundError;
  }
  static is(error) {
    return error.pwType === errorTypes.notFoundError;
  }
}

module.exports = {
  ServiceRequestError,
  ServiceRequestErrorJSON,
  NotFoundError,
};
