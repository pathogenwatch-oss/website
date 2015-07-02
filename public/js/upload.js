/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
$(document).ready(function () {

  function outputMessage(msg) {
    $('#errors')
      .fadeOut(300, function () {
        $(this)
          .text(msg)
          .fadeIn(300);
      })
  }

  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    var dt = e.dataTransfer;
    dt.effectAllowed = dt.dropEffect = 'copy';
    document.documentElement.className = (e.type === 'dragover' ? 'hover' : '');
  }

  function fileSelectHandler(e) {
    fileDragHover(e);
    var files = e.target.files || e.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
      parseFile(this, f);
    }
  }

  function parseFile(filedrag, file) {
    var mimeType = /^application\/json$/;
    var fileExtension = /.*\.json$/

    if ((file.type !== '' && file.type.match(mimeType)) || file.name.match(fileExtension)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var fileContents = reader.result;
        if (fileContents.indexOf('{') !== 0) {
          return outputMessage('File format not supported.');
        }
        try {
          fileContents = JSON.parse(reader.result)
        } catch (e) {
          outputMessage('Unable to parse file.');
          return;
        }

        $.ajax({
          type: 'POST',
          url: '/api/1.0/project',
          data: reader.result,
          contentType: 'application/json'
        })
        .done(function (projectMetadata) {
          var project = $.extend(projectMetadata, fileContents);
          var shortId = project.short_id;
          localStorage.setItem(
            'microreact', JSON.stringify(project)
          );
          window.location.assign('/' + shortId);
        });
      };

      reader.readAsText(file);
    } else {
      outputMessage('File format not supported.');
    }
  }

  function preventDrag(e) {
    e.stopPropagation();
    e.preventDefault();
    var dt = e.dataTransfer;
    dt.effectAllowed = dt.dropEffect = 'none';
  }

  function initialise() {
    document.addEventListener('dragover', fileDragHover, false);
    document.addEventListener('dragleave', fileDragHover, false);
    document.addEventListener('drop', fileSelectHandler, false);
  }

  if (window.File && window.FileList && window.FileReader) {
    initialise();
  }

});
