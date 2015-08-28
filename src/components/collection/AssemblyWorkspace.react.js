import '../../css/upload-review.css';

import React from 'react';
import FileDragAndDrop from 'react-file-drag-and-drop';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';

import Map from './Map.react';
import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import UploadWorkspaceNavigation from './UploadWorkspaceNavigation.react';
import UploadReviewHeader from './UploadReviewHeader.react.js';
import UploadStore from '../../stores/UploadStore.js';
import Overview from './Overview.react';

import UploadActionCreators from '../../actions/UploadActionCreators';
import SocketActionCreators from '../../actions/SocketActionCreators';
import FileProcessingStore from '../../stores/FileProcessingStore';
import SocketStore from '../../stores/SocketStore';
import SocketUtils from '../../utils/Socket';
import DEFAULT from '../../defaults.js';
import { validateMetadata } from '../../utils/Metadata.js';

const loadingAnimationStyle = {
  display: 'block',
};

const layoutContentStyle = {
  background: DEFAULT.CGPS.COLOURS.GREY_LIGHT,
  position: 'relative',
};

const AssemblyWorkspace = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object,
    totalAssemblies: React.PropTypes.number,
  },

  getInitialState: function () {
    return {
      isProcessing: false,
      uploadButtonActive: false,
    };
  },

  componentDidMount: function () {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);
    UploadStore.addChangeListener(this.activateUploadButton);

    const socket = SocketUtils.socketConnect();

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
    if (!SocketStore.getRoomId()) {
      SocketStore.getSocketConnection().on('roomId', function iife(roomId) {
        // console.log('[Macroreact] Got socket room id ' + roomId);
        SocketActionCreators.setRoomId(roomId);
      });

      SocketStore.getSocketConnection().emit('getRoomId');
    }
  },

  handleFileProcessingStoreChange: function () {
    this.setState({
      isProcessing: FileProcessingStore.getFileProcessingState(),
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

  activateUploadButton: function () {
    const assemblies = UploadStore.getAssemblies();
    const isValidMap = validateMetadata(assemblies);
    let isValid = true;

    if (!Object.keys(isValidMap)) {
      isValid = false;
    }

    for (const id in isValidMap) {
      if (!isValidMap[id]) {
        isValid = false;
        break;
      }
    }

    this.setState({
      uploadButtonActive: isValid,
    });
  },

  render: function () {
    loadingAnimationStyle.display = this.state.isProcessing ? 'block' : 'none';
    const locations = {};
    let metadataTitle = 'Metadata';
    if (this.props.assembly) {
      locations[this.props.assembly.fasta.name] = this.props.assembly.metadata.geography;
      metadataTitle += ' - ' + this.props.assembly.fasta.name;
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="assemblyWorkspaceContainer mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader title="WGSA - Upload" activateUploadButton={this.state.uploadButtonActive} />
          <div id="loadingAnimation" style={loadingAnimationStyle} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

          <UploadWorkspaceNavigation assembliesUploaded={this.props.assembly ? true : false} totalAssemblies={this.props.totalAssemblies}/>

          <main className="mdl-layout__content" style={layoutContentStyle}>
            { this.props.assembly &&
              <div>
                <div className="mdl-grid">
                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="card-style">
                      <div className="heading"> {metadataTitle} </div>
                      <AssemblyMetadata assembly={this.props.assembly} />
                    </div>
                  </div>

                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="cardStyle--no-padding">
                      <Map width={"100%"} height={200} locations={locations}/>
                    </div>
                  </div>


                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="card-style">
                      <div className="heading"> Analysis </div>
                      <AssemblyAnalysis assembly={this.props.assembly} />
                    </div>
                  </div>

                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="card-style">
                      <div className="heading"> Chart </div>
                      <AssemblyAnalysisChart analysis={this.props.assembly.analysis} />
                    </div>
                  </div>

                </div>
              </div>

              ||

              <Overview />
            }
          </main>
        </div>
      </FileDragAndDrop>
    );
  },

});

module.exports = AssemblyWorkspace;
