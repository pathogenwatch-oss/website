var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var assign = require('object-assign');
var FileUploadingProgressStore = require('../../stores/FileUploadingProgressStore');

var containerStyle = {
  margin: '40px 0 0 0'
};

var FileUploadingProgress = React.createClass({

  getInitialState: function () {
    return {
      progressPercentage: FileUploadingProgressStore.getProgressPercentage()
    };
  },

  componentDidMount: function () {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  componentWillUnmount: function () {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  handleFileUploadingProgressStoreChange: function () {
    this.setState({
      progressPercentage: FileUploadingProgressStore.getProgressPercentage()
    });
  },

  createAssemblyElements: function () {
    var fileAssemblyIds = UploadStore.getFileAssemblyIds();

    return fileAssemblyIds.map(function iife(fileAssemblyId) {
      return (
        <tr>
          <td>{fileAssemblyId}</td>
          {this.createAssemblyResultElements(fileAssemblyId)}
        </tr>
      );
    }.bind(this));
  },

  createAssemblyResultElements: function (fileAssemblyId) {
    var assemblyResults = FileUploadingStore.getAssemblyProcessingResults();

    return assemblyResults.map(function iife(assemblyResult) {
      return (
        <td><i className="fa fa-square"></i></td>
      );
    });
  },

  render: function () {
    var style = {
      width: this.state.progressPercentage + '%'
    };

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-1"></div>
          <div className="col-sm-1"></div>
          <div className="col-sm-1"></div>
          <div className="col-sm-1"></div>
          <div className="col-sm-1"></div>

        </div>
      </div>
    );

    return (
      <div className="progress" style={containerStyle}>
        <div className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow={this.state.progressPercentage} aria-valuemin="0" aria-valuemax="100" style={style}>
          <span className="sr-only">{this.state.progressPercentage + '% Complete'}</span>
        </div>
      </div>
    );
  }
});

module.exports = FileUploadingProgress;
