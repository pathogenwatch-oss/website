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
import Overview from './Overview.react';

import UploadActionCreators from '../../actions/UploadActionCreators';
import SocketActionCreators from '../../actions/SocketActionCreators';
import FileProcessingStore from '../../stores/FileProcessingStore';
import SocketStore from '../../stores/SocketStore';
import SocketUtils from '../../utils/Socket';
import DEFAULT from '../../defaults.js';
import '../../css/UploadReview.css';

var loadingAnimationStyle = {
  display: 'block'
};

var layoutContentStyle = {
  background: DEFAULT.CGPS.COLOURS.GREY
}

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
        // console.log('[Macroreact] Got socket room id ' + roomId);
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
    loadingAnimationStyle.display = this.state.isProcessing ? 'block' : 'none';
    const locations = {};
    var label = null;
    if (this.props.assembly) {
      locations[this.props.assembly.fasta.name] = this.props.assembly.metadata.geography;
      label = locations[this.props.assembly.fasta.name].location;
    }
    // console.log(label)
    const allLocations = UploadStore.getAllMetadataLocations();
    // console.log('single location', label);
    // console.log('All Locations: ', allLocations);
    // console.log('rendering: isProcessing: ', this.state.isProcessing)
    // console.log(this.props.assembly)
    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer'>
            <UploadReviewHeader title='WGSA' />
            <div id="loadingAnimation" style={loadingAnimationStyle} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

            <UploadWorkspaceNavigation assembliesUploaded={this.props.assembly?true:false} totalAssemblies={this.props.totalAssemblies}/>

            <main className="mdl-layout__content" style={layoutContentStyle}>
              { this.props.assembly &&
                <div className='assemblyWorkspaceDataDisplayContainer'>
                  <div className='mdl-grid'>
                    <div className='mdl-cell mdl-cell--6-col'>
                      <AssemblyWorkspaceHeader text='Metadata' />
                      <AssemblyMetadata assembly={this.props.assembly} />
                    </div>

                    <div className='mdl-cell mdl-cell--6-col'>
                      <Map width={300} height={200} label={label} locations={locations}/>
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
  }
});

module.exports = AssemblyWorkspace;
//                     <Map width={500} height={400} label='Global Map' locations={allLocations}/>
