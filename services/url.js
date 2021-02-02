const config = require("./configuration");

function absoluteUrl(paths, query) {
  const url = new URL(
    Array.isArray(paths) ? paths.join("/") : paths,
    config.baseUrl
  );
  if (query) {
    for (const key of Object.keys(query)) {
      url.searchParams.append(key, query[key]);
    }
  }

  return url.href;
}

function relativeUrl(paths, query) {
  const baseUrl = new URL(config.baseUrl);
  const url = new URL(
    Array.isArray(paths) ? paths.join("/") : paths,
    baseUrl.pathname
  );
  if (query) {
    for (const key of Object.keys(query)) {
      url.searchParams.append(key, query[key]);
    }
  }

  return url.href;
}

module.exports = {
  absolute: absoluteUrl,
  relative: relativeUrl,
};
