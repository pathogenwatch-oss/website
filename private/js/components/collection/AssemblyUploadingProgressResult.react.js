var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var assign = require('object-assign');
var FileUploadingProgressStore = require('../../stores/FileUploadingProgressStore');

var ICONS = {
  NOT_RECEIVED: 'fa-square-o',
  RECEIVED: 'fa-check-square-o'
};

var FileUploadingProgress = React.createClass({

  getInitialState: function () {
    return {
      received: false
    };
  },

  render: function () {
    retun (
      <td><i className="fa fa-square"></i></td>
    );
  }
});

module.exports = FileUploadingProgress;
