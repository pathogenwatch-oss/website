const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoSessionStore = require("connect-mongo")(session);
const userAccounts = require("cgps-user-accounts/src");

const config = require("../services/configuration");
const mongoConnection = require("../src/utils/mongoConnection");
const userStore = require("../src/utils/userStore");

module.exports = function (app) {
  // required for passport.js
  app.use(cookieParser());
  app.use(
    session({
      secret: config.node.sessionSecret,
      store: new MongoSessionStore({ url: mongoConnection.dbUrl }),
      resave: true,
      saveUninitialized: true,
    })
  );

  userAccounts(
    app,
    {
      userStore,
      url: config.passport.url,
      authPath: "/auth",
      successRedirect: "/",
      failureRedirect: "/",
      logoutPath: "/signout",
      strategies: config.passport.strategies,
      tokens: config.passport.tokens,
      mongoDbUrl: mongoConnection.dbUrl,
    }
  );

};
