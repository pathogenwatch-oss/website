import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';

import FileDragAndDrop from './DragAndDrop.react';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';
import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import UploadWorkspaceNavigation from './UploadWorkspaceNavigation.react';
import UploadReviewHeader from './UploadReviewHeader.react';
import Overview from './Overview.react';
import UploadingFilesDetailed from './UploadingFilesDetailed.react';

import UploadActionCreators from '^/actions/UploadActionCreators';
import UploadStore from '^/stores/UploadStore';
import SocketActionCreators from '^/actions/SocketActionCreators';
import UploadWorkspaceNavigationActionCreators from '^/actions/UploadWorkspaceNavigationActionCreators';
import ToastActionCreators from '^/actions/ToastActionCreators';

import UploadWorkspaceNavigationStore from '^/stores/UploadWorkspaceNavigationStore';
import FileProcessingStore from '^/stores/FileProcessingStore';
import FileUploadingStore from '^/stores/FileUploadingStore';
import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';
import SocketStore from '^/stores/SocketStore';

import SocketUtils from '^/utils/Socket';
import Species from '^/species';
import DEFAULT from '^/defaults';

const loadingAnimationStyleVisible = {
  visibility: 'visible',
};

const loadingAnimationStyleHidden = {
  visibility: 'hidden',
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
    history: React.PropTypes.object,
  },

  getInitialState() {
    return {
      readyToUpload: false,
      confirmedMultipleMetadataDrop: false,
      pageTitleMessage: 'Upload',
      isUploading: FileUploadingStore.getFileUploadingState(),
      numberOfAssemblies: UploadStore.getAssembliesCount(),
      viewPage: 'overview',
      assemblyName: null,
      uploadProgressPercentage: 0,
      collectionUrl: null,
    };
  },

  componentDidMount() {
    FileProcessingStore.addChangeListener(this.handleFileProcessingStoreChange);
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.addChangeListener(this.handleUploadStoreChange);

    const socket = SocketUtils.socketConnect();

    socket.on('connect', function () {
      console.log('[WGSA] Socket connected');
    });

    socket.on('disconnect', function () {
      console.error('[WGSA] Socket connection disconnected');
    });

    SocketActionCreators.setSocketConnection(socket);
  },

  componentWillUnmount() {
    FileProcessingStore.removeChangeListener(this.handleFileProcessingStoreChange);
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.removeChangeListener(this.handleUploadStoreChange);

    SocketStore.getSocketConnection().disconnect();
    FileUploadingProgressStore.clearStore();
    UploadStore.clearStore();
    FileUploadingStore.clearStore();
  },

  handleFileProcessingStoreChange() {
    isProcessing = FileProcessingStore.getFileProcessingState();
    this.setState({
      pageTitleMessage: isProcessing ? 'Processing...' : 'Overview',
    });
  },

  handleFileUploadingStoreChange() {
    const uploadingResult = FileUploadingStore.getFileUploadingResult();
    const id = FileUploadingStore.getCollectionId();
    const path = `/${Species.nickname}/collection/${id}`;
    const { history } = this.context;
    if (uploadingResult === FileUploadingStore.getFileUploadingResults().SUCCESS) {
      history.pushState(null, path);
      return;
    }

    this.setState({
      isUploading: FileUploadingStore.getFileUploadingState(),
      viewPage: 'upload_progress',
      collectionUrl: id ? window.location.origin + path : null,
    });
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      viewPage: UploadWorkspaceNavigationStore.getCurrentViewPage(),
      assemblyName: UploadWorkspaceNavigationStore.getAssemblyName(),
    });
  },

  confirmDuplicateOverwrite(files) {
    this.setState({
      confirmedMultipleMetadataDrop: true,
    });
    UploadActionCreators.addFiles(files);
  },

  handleDrop(event) {
    if (event.files.length > 0 && !this.state.isUploading) {
      if (!this.state.confirmedMultipleMetadataDrop && this.state.numberOfAssemblies > 0) {
        ToastActionCreators.showToast({
          message: 'Duplicate records will be overwritten.',
          action: {
            label: 'confirm',
            onClick: this.confirmDuplicateOverwrite.bind(this, Array.from(event.files)),
          },
          sticky: true,
        });
      } else {
        UploadActionCreators.addFiles(event.files);
      }
      // allows the same file to be uploaded consecutively
      this.refs.fileInput.value = '';
    }
  },

  handleClick() {
    if (this.state.isUploading) {
      UploadWorkspaceNavigationActionCreators.setViewPage('upload_progress');
    } else {
      this.refs.fileInput.click();
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
      readyToUpload: UploadStore.isReadyToUpload(),
      numberOfAssemblies: UploadStore.getAssembliesCount(),
    });
  },

  render() {
    let subtitle = '';
    const assembly = UploadStore.getAssembly(this.state.assemblyName);

    switch (this.state.viewPage) {
    case 'assembly':
      subtitle = assembly && assembly.fasta.name;
      break;
    case 'upload_progress':
      subtitle = 'Uploading...';
      break;
    default: subtitle = this.state.pageTitleMessage;
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader subtitle={subtitle} activateUploadButton={this.state.readyToUpload} isUploading={this.state.isUploading} />

          <UploadWorkspaceNavigation assembliesUploaded={assembly ? true : false} totalAssemblies={this.state.numberOfAssemblies}>
            <footer className="wgsa-upload-navigation__footer mdl-shadow--4dp">
              <button type="button" title="Overview"
                className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={this.handleOverviewClick}>
                Overview
              </button>

              { !this.state.isUploading &&
                <button type="button" title="Add files"
                  className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={this.handleClick}>
                  Add Files
                </button>
              }
            </footer>
          </UploadWorkspaceNavigation>

          <main className="mdl-layout__content" style={layoutContentStyle}>
            <div id="loadingAnimation" style={isProcessing ? loadingAnimationStyleVisible : loadingAnimationStyleHidden} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

            {
              (() => {
                switch (this.state.viewPage) {
                case 'assembly':
                  return (
                    <div className="mdl-grid">
                      <div className="mdl-cell mdl-cell--6-col wgsa-card-column">
                        <div className="wgsa-card mdl-shadow--2dp">
                          <div className="wgsa-card-heading">Assembly Statistics</div>
                          <div className="wgsa-card-content">
                            <AssemblyAnalysis assembly={assembly}/>
                          </div>
                        </div>
                      </div>
                      <div className="mdl-cell mdl-cell--6-col wgsa-card-column chart-card">
                        <div className="wgsa-card mdl-shadow--2dp">
                          <div className="wgsa-card-heading">N50 Chart</div>
                          <div className="wgsa-card-content ">
                            <AssemblyAnalysisChart metrics={assembly && assembly.metrics} />
                          </div>
                        </div>
                      </div>
                      <div className="wgsa-card mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--2dp">
                        <div className="wgsa-card-heading">Metadata</div>
                        <div className="wgsa-card-content">
                          <AssemblyMetadata assembly={assembly} isUploading={this.state.isUploading}/>
                        </div>
                      </div>
                    </div>
                  );
                case 'overview':
                  return (
                   <Overview clickHandler={this.handleClick} isUploading={this.state.isUploading} isReadyToUpload={this.state.readyToUpload} />
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
