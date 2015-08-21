import React from 'react';
import assign from 'object-assign';
import FileDragAndDrop from 'react-file-drag-and-drop';

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
import io from 'socket.io-client';
import SocketUtils from '../../utils/Socket';


var divStyle = {
  background: 'red',
  height: '100%'
};

var AssemblyWorkspace = React.createClass({

  // location: this.props.assembly.location,

  propTypes: {
    assembly: React.PropTypes.object.isRequired,
    totalAssemblies: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      isProcessing: false
    };
  },

  componentDidMount: function() {
    var container = this.getDOMNode('assemblyWorkspaceContainer');
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
    locations[this.props.assembly.fasta.name] = this.props.assembly.metadata.geography.position;
    const allLocations = UploadStore.getAllMetadataLocations();
    console.log(allLocations);

    return (
      <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
        <UploadReviewHeader title='Upload Review' />
        <FileDragAndDrop onDrop={this.handleDrop}>

          <main className='assemblyWorkspaceContainer mdl-layout__content'>

            <UploadWorkspaceNavigation totalAssemblies={this.props.totalAssemblies}/>

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
        </FileDragAndDrop>

      </div>
    );
  }
});

module.exports = AssemblyWorkspace;
