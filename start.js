const createAsyncExpressApp = require("../server/create-async-express-app");
const createServer = require("./server/index");
const { BaseLogger } = require("./services/logger");

Promise.resolve(createAsyncExpressApp())
  .then(createServer)
  .then(() => BaseLogger.info("*** Application started ***"))
  .catch((error) => {
    BaseLogger.error(error);
    BaseLogger.error("*** Application not started ***");
    return process.exit(1);
  });
