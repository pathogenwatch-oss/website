var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var assign = require('object-assign');
var UploadActionCreators = require('../../actions/UploadActionCreators');
var SocketActionCreators = require('../../actions/SocketActionCreators');
var FileProcessingStore = require('../../stores/FileProcessingStore');
var SocketStore = require('../../stores/SocketStore');
var io = require('socket.io-client');
var SocketUtils = require('../../utils/Socket');

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
  border: '2px dotted #bbb',
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

var FA_CLOUD_UPLOAD_CLASS = 'fa fa-cloud-upload';
var FA_COG_CLASS = 'fa fa-cog';
var FA_SPIN_CLASS = 'fa-spin';

var ANIMATION_CLASSES = {
  BOUNCE: 'animated bounce infinite',
  PULSE: 'animated pulse infinite'
};

var DragAndDropFiles = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      isProcessing: false
    };
  },

  componentDidMount: function () {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);

    var socket = SocketUtils.socketConnect();

    socket.on('connect', function iife() {
      console.log('[Macroreact] Socket connected');
    });

    SocketStore.addChangeListener(this.handleSocketStoreChange);
    SocketActionCreators.setSocketConnection(socket);
  },

  componentWillUnmount: function () {
    FileProcessingStore.removeChangeListener(this.handleFileProcessingStoreChange);
    SocketStore.removeChangeListener(this.handleSocketStoreChange);
  },

  handleSocketStoreChange: function () {
    if (! SocketStore.getRoomId()) {

      SocketStore.getSocketConnection().on('roomId', function iife(roomId) {
        console.log('[Macroreact] Got socket room id ' + roomId);
        SocketActionCreators.setRoomId(roomId);
      });

      SocketStore.getSocketConnection().emit('getRoomId');
    }
  },

  handleFileProcessingStoreChange: function () {
    this.setState({
      isProcessing: FileProcessingStore.getFileProcessingState()
    });
  },

  hasDroppedFiles: function (event) {
    return (event.files.length > 0);
  },

  handleDrop: function (event) {
    if (this.hasDroppedFiles(event)) {
      UploadActionCreators.addFiles(event.files);
    }
  },

  render: function () {
    var iconClasses = FA_CLOUD_UPLOAD_CLASS + ' ' + ANIMATION_CLASSES.PULSE;

    if (this.state.isProcessing) {
      iconClasses = FA_COG_CLASS + ' ' + FA_SPIN_CLASS;
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>

        <div style={dropZoneStyle}>
          <div style={dropTargetContainerStyle}>
            <div style={dropTargetStyle}>
              <i className={iconClasses} style={iconStyle}></i>

              { this.state.isProcessing ?
                <h2 style={headerStyle}><span style={featureStyle}>Processing</span> your files.</h2>
              :
                <h2 style={headerStyle}>Drop your files here for <span style={featureStyle}>quick analysis</span> and <span style={featureStyle}>easy upload</span>.</h2>
              }
            </div>
          </div>
        </div>
      </FileDragAndDrop>
    );
  }
});

module.exports = DragAndDropFiles;
