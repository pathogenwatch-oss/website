var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var assign = require('object-assign');
var FileUploadingProgressStore = require('../../stores/FileUploadingProgressStore');

var containerStyle = {
  margin: '20px 0 0 0'
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

  render: function () {
    var style = {
      width: this.state.progressPercentage + '%'
    };

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
