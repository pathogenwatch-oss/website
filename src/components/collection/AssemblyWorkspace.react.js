import React from 'react';
import assign from 'object-assign';
import FileDragAndDrop from 'react-file-drag-and-drop';
import io from 'socket.io-client';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';
import AssemblyWorkspaceHeader from './AssemblyWorkspaceHeader.react';
import Map from './Map.react';
import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';
import AssemblyAnalysisOverviewChart from './AssemblyAnalysisOverviewChart.react';
import UploadWorkspaceNavigation from './UploadWorkspaceNavigation.react';
import UploadReviewHeader from './UploadReviewHeader.react.js';
import UploadStore from '../../stores/UploadStore.js';

import UploadActionCreators from '../../actions/UploadActionCreators';
import SocketActionCreators from '../../actions/SocketActionCreators';
import FileProcessingStore from '../../stores/FileProcessingStore';
import SocketStore from '../../stores/SocketStore';
import SocketUtils from '../../utils/Socket';
import DEFAULT from '../../defaults.js';
import '../../css/UploadReview.css';

const welcomeText = {
  color: DEFAULT.CGPS.COLOURS.GREEN_MID
};

const AssemblyWorkspace = React.createClass({

  // location: this.props.assembly.location,

  propTypes: {
    assembly: React.PropTypes.object,
    totalAssemblies: React.PropTypes.number
  },

  getInitialState: function () {
    return {
      isProcessing: false
    };
  },

  componentDidMount: function() {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);

    const socket = SocketUtils.socketConnect();

    socket.on('connect', function iife() {
      console.log('[Macroreact] Socket connected');
    });

    SocketStore.addChangeListener(this.handleSocketStoreChange);
    SocketActionCreators.setSocketConnection(socket);

    const container = this.getDOMNode('assemblyWorkspaceContainer');
    container.style.height = window.innerHeight;
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
    const locations = {};
    if (this.props.assembly) {
      locations[this.props.assembly.fasta.name] = this.props.assembly.metadata.geography.position;
    }
    const allLocations = UploadStore.getAllMetadataLocations();
    console.log('All Locations: ', allLocations);
    return (
      <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
        {
          this.props.assembly &&
            <UploadReviewHeader title='Macroreact: Upload Preview' />
          ||
            <UploadReviewHeader title='Macroreact' />
        }
        <FileDragAndDrop onDrop={this.handleDrop}>
          <UploadWorkspaceNavigation assembliesUploaded={this.props.assembly?true:false} totalAssemblies={this.props.totalAssemblies}/>

          {
            this.props.assembly &&
            <main className='assemblyWorkspaceContainer mdl-layout__content'>
              <div className='assemblyWorkspaceDataDisplayContainer'>
                <div className='mdl-grid'>
                  <div className='mdl-cell mdl-cell--6-col'>
                    <AssemblyWorkspaceHeader text='Metadata' />
                    <AssemblyMetadata assembly={this.props.assembly} />
                  </div>

                  <div className='mdl-cell mdl-cell--6-col'>
                  </div>

                  <div className='mdl-cell mdl-cell--6-col'>
                    <AssemblyWorkspaceHeader text='Analysis' />
                    <AssemblyAnalysis assembly={this.props.assembly} />
                  </div>

                  <div className='mdl-cell mdl-cell--6-col'>
                    <AssemblyWorkspaceHeader text='Chart' />
                    <AssemblyAnalysisChart analysis={this.props.assembly.analysis} />
                  </div>

                  <div className='mdl-cell mdl-cell--6-col'>
                    <AssemblyWorkspaceHeader text='Overview Chart' />
                    <AssemblyAnalysisOverviewChart analysis={this.props.assembly.analysis} />
                  </div>

                  <div className='mdl-cell mdl-cell--6-col'>
                    <Map width={500} height={400} label='Global Map' locations={allLocations}/>
                  </div>
                </div>
              </div>
            </main>

            ||

            <main className='assemblyWorkspaceContainer mdl-layout__content'>
              <div className="welcomeContainer">
                <div className="welcome-card-wide mdl-card mdl-shadow--0dp">
                  <div className="mdl-card__title">
                    <h2 style={welcomeText} className="mdl-card__title-text">Drop your assemblies here for quick analysis and easy upload!</h2>
                  </div>
                  <div className="mdl-card__supporting-text">
                  </div>
                  {
                    this.state.isProcessing &&
                      <div id="loadingAnimation" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
                  }
                </div>
                <h4></h4>
              </div>
            </main>
          }
        </FileDragAndDrop>
      </div>
    );
  }
});

module.exports = AssemblyWorkspace;
