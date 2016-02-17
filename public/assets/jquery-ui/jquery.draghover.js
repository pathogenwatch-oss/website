// https://gist.github.com/gists/3794126 http://stackoverflow.com/a/10310815/4196
$.fn.draghover = function(options) {
  return this.each(function() {
    var collection = $();
    var self = $(this);
    self.on("dragenter", function(event) {
      if (collection.size() === 0) {
        self.trigger("draghoverstart", event);
      }
      collection = collection.add(event.target);
    });
    self.on("dragleave drop", function(event) {
      setTimeout(function() {
        collection = collection.not(event.target);
        if (collection.size() === 0) {
          self.trigger("draghoverend");
        }
      }, 1);
    })
  })
};
