import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';
import FileDragAndDrop from 'react-file-drag-and-drop';
import createThemeManager from 'material-ui/lib/styles/theme-manager';
import injectTapEventPlugin from 'react-tap-event-plugin';

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

const ThemeManager = createThemeManager();
injectTapEventPlugin();

const loadingAnimationStyle = {
  display: 'block',
};

const layoutContentStyle = {
  background: DEFAULT.CGPS.COLOURS.GREY_LIGHT,
  position: 'relative',
};

const fileInputStyle = {
  position: 'absolute',
  zIndex: -1,
  opacity: 0,
};

const AssemblyWorkspace = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object,
    totalAssemblies: React.PropTypes.number,
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState() {
    return {
      isProcessing: false,
      uploadButtonActive: false,
      confirmedMultipleMetadataDrop: false,
      pageTitleAppend: 'Upload'
    };
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  },

  componentDidMount() {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);
    UploadStore.addChangeListener(this.activateUploadButton);

    const socket = SocketUtils.socketConnect();

    socket.on('connect', function iife() {
      console.log('[Macroreact] Socket connected');
    });

    SocketStore.addChangeListener(this.handleSocketStoreChange);
    SocketActionCreators.setSocketConnection(socket);
  },

  componentWillUnmount() {
    FileProcessingStore.removeChangeListener(this.handleFileProcessingStoreChange);
    SocketStore.removeChangeListener(this.handleSocketStoreChange);
  },

  handleSocketStoreChange() {
    if (!SocketStore.getRoomId()) {
      SocketStore.getSocketConnection().on('roomId', function iife(roomId) {
        // console.log('[Macroreact] Got socket room id ' + roomId);
        SocketActionCreators.setRoomId(roomId);
      });

      SocketStore.getSocketConnection().emit('getRoomId');
    }
  },

  handleFileProcessingStoreChange() {
    this.setState({
      isProcessing: FileProcessingStore.getFileProcessingState(),
    });
  },

  handleDrop(event) {
    if (event.files.length > 0) {
      if (!this.state.confirmedMultipleMetadataDrop && this.props.totalAssemblies > 0) {
        var multipleDropConfirm = confirm('Duplicate records will be overwritten');
        if (multipleDropConfirm) {
          this.setState({
            confirmedMultipleMetadataDrop: true,
          });
          UploadActionCreators.addFiles(event.files);
        }
      } else {
        UploadActionCreators.addFiles(event.files);
      }
      this.setState({
        pageTitleAppend: 'Overview'
      })
    }
  },

  handleClick() {
    React.findDOMNode(this.refs.fileInput).click();
  },

  handleFileInputChange(event) {
    this.handleDrop(event.target);
  },

  activateUploadButton() {
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

  render() {
    loadingAnimationStyle.display = this.state.isProcessing ? 'block' : 'none';
    const locations = {};
    let pageTitle = 'WGSA';

    if (this.props.assembly) {
      locations[this.props.assembly.fasta.name] = this.props.assembly.metadata.geography;
      pageTitle = `WGSA | ${this.props.assembly.fasta.name}`;
    } else {
      pageTitle = `WGSA | ${this.state.pageTitleAppend}`;
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="assemblyWorkspaceContainer mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader title={pageTitle} activateUploadButton={this.state.uploadButtonActive} />
          <div id="loadingAnimation" style={loadingAnimationStyle} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

          <UploadWorkspaceNavigation assembliesUploaded={this.props.assembly ? true : false} totalAssemblies={this.props.totalAssemblies}>
            <footer className="wgsa-upload-navigation__footer mdl-shadow--4dp">
              <button className="mdl-button mdl-button--raised" title="" onClick={this.handleClick}>
                Add files
              </button>
            </footer>
          </UploadWorkspaceNavigation>

          <main className="mdl-layout__content" style={layoutContentStyle}>
            { this.props.assembly &&
              <div>
                <div className="mdl-grid">
                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="heading"> Metadata </div>

                    <div className="card-style">
                      <AssemblyMetadata key={this.props.assembly.metadata.fileAssemblyId} assembly={this.props.assembly} />
                    </div>
                  </div>

                  <div ref="mapDiv" className="mapDivStyle mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="cardStyle--no-padding">
                      <Map width={"100%"} height={300} locations={locations}/>
                    </div>
                  </div>

                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="heading"> Analysis </div>
                    <div className="card-style">
                      <AssemblyAnalysis assembly={this.props.assembly} />
                    </div>
                  </div>

                  <div className="mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                    <div className="heading"> Chart </div>
                    <div className="card-style">
                      <AssemblyAnalysisChart analysis={this.props.assembly.analysis} />
                    </div>
                  </div>

                </div>
              </div>

              ||

              <Overview clickHandler={this.handleClick} />

            }
          </main>
        </div>
        <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />
      </FileDragAndDrop>
    );
  },

});

module.exports = AssemblyWorkspace;
