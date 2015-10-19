import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';
import FileDragAndDrop from 'react-file-drag-and-drop';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';
import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import UploadWorkspaceNavigation from './UploadWorkspaceNavigation.react';
import UploadReviewHeader from './UploadReviewHeader.react';
import Overview from './Overview.react';
import UploadingFilesDetailed from './UploadingFilesDetailed.react';

import UploadActionCreators from '../../actions/UploadActionCreators';
import UploadStore from '../../stores/UploadStore';
import SocketActionCreators from '../../actions/SocketActionCreators';
import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators';
import ToastActionCreators from '../../actions/ToastActionCreators';

import UploadWorkspaceNavigationStore from '../../stores/UploadWorkspaceNavigationStore';
import FileProcessingStore from '../../stores/FileProcessingStore';
import FileUploadingStore from '../../stores/FileUploadingStore';
import FileUploadingProgressStore from '../../stores/FileUploadingProgressStore';
import SocketStore from '../../stores/SocketStore';

import SocketUtils from '../../utils/Socket';
import Species from '../../species';
import DEFAULT from '../../defaults';

const loadingAnimationStyle = {
  visibility: 'visible',
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

let isProcessing = false;

export default React.createClass({

  contextTypes: {
    router: React.PropTypes.func,
  },

  getInitialState() {
    return {
      uploadButtonActive: false,
      confirmedMultipleMetadataDrop: false,
      pageTitleAppend: 'Upload',
      isUploading: FileUploadingStore.getFileUploadingState(),
      viewPage: 'overview',
      totalAssemblies: 0,
      assemblyName: null,
      uploadProgressPercentage: 0,
      collectionUrl: null,
    };
  },

  componentDidMount() {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.addChangeListener(this.handleUploadStoreChange);

    const socket = SocketUtils.socketConnect();

    socket.on('connect', function () {
      console.log('[Macroreact] Socket connected');
    });

    socket.on('disconnect', function () {
      console.error('[Macroreact] Socket connection lost');
    });

    SocketStore.addChangeListener(this.handleSocketStoreChange);
    SocketActionCreators.setSocketConnection(socket);
  },

  componentWillUnmount() {
    FileProcessingStore.removeChangeListener(this.handleFileProcessingStoreChange);
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
    SocketStore.removeChangeListener(this.handleSocketStoreChange);
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
  },

  handleSocketStoreChange() {
    if (!SocketStore.getRoomId()) {
      SocketStore.getSocketConnection().on('roomId', function iife(roomId) {
        SocketActionCreators.setRoomId(roomId);
      });

      SocketStore.getSocketConnection().emit('getRoomId');
    }
  },

  handleFileProcessingStoreChange() {
    isProcessing = FileProcessingStore.getFileProcessingState();
    this.setState({
      pageTitleAppend: isProcessing ? 'Processing...' : 'Overview',
    });
  },

  handleFileUploadingStoreChange() {
    const uploadingResult = FileUploadingStore.getFileUploadingResult();
    const id = FileUploadingStore.getCollectionId();
    const { transitionTo, makePath } = this.context.router;
    if (uploadingResult === FileUploadingStore.getFileUploadingResults().SUCCESS) {
      transitionTo(makePath('collection', { species: Species.nickname, id }));
      return;
    }

    this.setState({
      isUploading: FileUploadingStore.getFileUploadingState(),
      viewPage: 'upload_progress',
      collectionUrl: id ? window.location.origin + makePath('collection', { species: Species.nickname, id }) : null,
    });
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      viewPage: UploadWorkspaceNavigationStore.getCurrentViewPage(),
      assemblyName: UploadWorkspaceNavigationStore.getAssemblyName(),
    });
  },

  handleConfirmDuplicateOverwrite(files, confirmed) {
    if (confirmed) {
      this.setState({
        confirmedMultipleMetadataDrop: true,
      });
      UploadActionCreators.addFiles(files);
    }

    UploadStore.hideToast();
  },

  handleDrop(event) {
    if (event.files.length > 0 && !this.state.isUploading) {
      if (!this.state.confirmedMultipleMetadataDrop && this.state.totalAssemblies > 0) {
        ToastActionCreators.fireToast({
          message: <ConfirmDuplicate confirmHandler={this.handleConfirmDuplicateOverwrite.bind(this, event.files)} />,
          type: 'warn',
          sticky: true,
        });
      } else {
        UploadActionCreators.addFiles(event.files);
      }
      // allows the same file to be uploaded consecutively
      React.findDOMNode(this.refs.fileInput).value = '';
    }
  },

  handleClick() {
    if (this.state.isUploading) {
      UploadWorkspaceNavigationActionCreators.setViewPage('upload_progress');
    } else {
      React.findDOMNode(this.refs.fileInput).click();
    }
  },

  handleOverviewClick() {
    UploadWorkspaceNavigationActionCreators.setViewPage('overview');
  },

  handleFileInputChange(event) {
    this.handleDrop(event.target);
  },

  handleUploadStoreChange() {
    this.setState({
      uploadButtonActive: UploadStore.isReadyToUpload(),
    });
  },

  handleFileUploadingProgressStoreChange() {
    const percentage = FileUploadingProgressStore.getProgressPercentage();
    this.setState({
      uploadProgressPercentage: percentage,
    });
  },

  render() {
    let pageTitle = 'WGSA';
    const assembly = UploadStore.getAssembly(this.state.assemblyName);

    loadingAnimationStyle.visibility = isProcessing ? 'visible' : 'hidden';
    switch (this.state.viewPage) {
    case 'assembly':
      pageTitle = `WGSA | ${assembly && assembly.fasta.name}`;
      break;
    case 'upload_progress':
      pageTitle = 'WGSA | Uploading...';
      break;
    default: pageTitle = `WGSA | ${this.state.pageTitleAppend}`;
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader title={pageTitle} activateUploadButton={this.state.uploadButtonActive} uploadProgressPercentage={this.state.uploadProgressPercentage} isUploading={this.state.isUploading} />

          <UploadWorkspaceNavigation assembliesUploaded={assembly ? true : false} totalAssemblies={this.state.totalAssemblies}>
            <footer className="wgsa-upload-navigation__footer mdl-shadow--4dp">
              <button type="button" title="Overview"
                className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
                onClick={this.handleOverviewClick}>
                <i className="material-icons">home</i>
              </button>

              { !this.state.isUploading &&
                <button type="button" title="Add files"
                  className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
                  onClick={this.handleClick}>
                  <i className="material-icons">add</i>
                </button>
              }
            </footer>
          </UploadWorkspaceNavigation>

          <main className="mdl-layout__content" style={layoutContentStyle}>
            <div id="loadingAnimation" style={loadingAnimationStyle} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

            {
              (() => {
                switch (this.state.viewPage) {
                case 'assembly':
                  return (
                    <div className="assemblyWorkspaceContainer mdl-grid assemblyWorkspaceContent">
                      <div className="overflow-y--auto mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                        <div className="heading"> Metadata </div>
                        <div className="card-style">
                          <AssemblyMetadata assembly={assembly} />
                        </div>
                      </div>
                      <div className="overflow-y--auto mdl-cell mdl-cell--6-col increase-cell-gutter mdl-shadow--4dp">
                        <div className="mdl-grid mdl-grid--no-spacing">
                          <div className="mdl-cell mdl-cell--12-col">
                            <div className="heading"> Assembly Statistics </div>
                            <div className="card-style">
                              <AssemblyAnalysis assembly={assembly} />
                            </div>
                          </div>
                          <div className="mdl-cell mdl-cell--12-col">
                            <div className="heading"> N50 Chart </div>
                            <div className="card-style">
                              <AssemblyAnalysisChart analysis={assembly && assembly.analysis} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                case 'overview':
                  return (
                   <Overview clickHandler={this.handleClick} uploadProgressPercentage={this.state.uploadProgressPercentage} isUploading={this.state.isUploading} isReadyToUpload={this.state.uploadButtonActive} />
                  );
                case 'upload_progress':
                  return (
                    <div>
                      <UploadingFilesDetailed collectionUrl={this.state.collectionUrl}/>
                    </div>
                  );
                default:
                  // should never hit default
                }
              })() }
          </main>
        </div>
        <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />

      </FileDragAndDrop>
    );
  },
});

const ConfirmDuplicate = React.createClass({
  render() {
    return (
      <div className="wgsa-confirm-duplicate-button">
        Any duplicate records encountered will be overwritten.
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
          onClick={this.props.confirmHandler.bind(this, true)}>
          Confirm
        </button>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
          onClick={this.props.confirmHandler.bind(this, false)}>
          Cancel
        </button>
      </div>
    );
  },
});
