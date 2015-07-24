var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var assign = require('object-assign');
var UploadActionCreators = require('../../actions/UploadActionCreators');
var SocketActionCreators = require('../../actions/SocketActionCreators');
var FileProcessingStore = require('../../stores/FileProcessingStore');
var SocketStore = require('../../stores/SocketStore');
var io = require('socket.io-client');
var SocketUtils = require('../../utils/Socket');
var FileUploadingProgress = require('./FileUploadingProgress.react');

var fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%'
};

var dropZoneStyle = assign({}, fullWidthAndHeightStyle, {
  background: '-webkit-gradient(linear,left top,left bottom,color-stop(0,#f7f7f7),color-stop(1,#ebebeb))',
  padding: '30px',
  overflow: 'scroll'
});

var dropTargetContainerStyle = assign({}, fullWidthAndHeightStyle, {
  display: 'table',
  textAlign: 'center'
});

var dropTargetStyle = {
  display: 'table-cell',
  verticalAlign: 'middle'
};

var iconStyle = {
  fontSize: '70px',
  color: '#bbb',
  textShadow: '1px 1px #fff'
};

var headerStyle = {
  fontWeight: '300',
  textShadow: '1px 1px #fff'
};

var featureStyle = {
  fontWeight: '500'
};

var FA_SPIN_CLASS = 'fa-spin';
var FA_COG_CLASS = 'fa fa-cog';
var ICON_CLASS = FA_COG_CLASS + ' ' + FA_SPIN_CLASS;

var UploadingFiles = React.createClass({
  render: function () {
    return (
      <div style={dropZoneStyle}>
        <div style={dropTargetContainerStyle}>
          <div style={dropTargetStyle}>
            <i className={ICON_CLASS} style={iconStyle}></i>
            <h2 style={headerStyle}><span style={featureStyle}>Uploading</span> and <span style={featureStyle}>analysing</span> your files.</h2>

            <div className="row">
              <div className="col-sm-8 col-sm-offset-2">
                <FileUploadingProgress />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = UploadingFiles;
