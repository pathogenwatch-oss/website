module.exports = function (options, callback) {
  var xmlhttp = new XMLHttpRequest();

  options.method = options.method || 'GET';

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status < 400) {
        try {
          callback(null, JSON.parse(xmlhttp.responseText));
        } catch (error) {
          callback(null, xmlhttp.responseText);
        }
      } else {
        callback(new Error(xmlhttp.responseText));
      }
    }
  };

  xmlhttp.open(options.method, options.url, true);

  if (xmlhttp.method === 'GET') {
    xmlhttp.send();
  } else {
    if (typeof options.data === 'string') {
      xmlhttp.setRequestHeader('Content-Type', 'text/plain');
    }
    xmlhttp.send(options.data);
  }
};
