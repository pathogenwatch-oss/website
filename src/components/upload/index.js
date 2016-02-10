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

import UploadActionCreators from '^/actions/UploadActionCreators';
import UploadStore from '^/stores/UploadStore';
import UploadWorkspaceNavigationActionCreators from '^/actions/UploadWorkspaceNavigationActionCreators';
import ToastActionCreators from '^/actions/ToastActionCreators';

import UploadWorkspaceNavigationStore from '^/stores/UploadWorkspaceNavigationStore';
import FileUploadingStore from '^/stores/FileUploadingStore';

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

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.object,
  },

  getInitialState() {
    return {
      readyToUpload: false,
      confirmedMultipleMetadataDrop: false,
      isProcessing: false,
      numberOfAssemblies: UploadStore.getAssembliesCount(),
      viewPage: 'overview',
      assemblyName: null,
      uploadProgressPercentage: 0,
      collectionUrl: null,
    };
  },

  componentDidMount() {
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.addChangeListener(this.handleUploadStoreChange);
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
  },

  componentWillUnmount() {
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
  },

  hideSidebar() {
    if (this.menuButton.getAttribute('aria-expanded') === 'true') {
      this.menuButton.click();
    }
  },

  handleFileUploadingStoreChange() {
    const id = FileUploadingStore.getCollectionId();
    if (!id) {
      this.setState({ isProcessing: true });
      return;
    }

    const path = `/${Species.nickname}/collection/${id}`;
    const { history } = this.context;
    history.pushState(null, path);
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      viewPage: UploadWorkspaceNavigationStore.getCurrentViewPage(),
      assemblyName: UploadWorkspaceNavigationStore.getAssemblyName(),
    });
    this.hideSidebar();
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
        this.setState({ isProcessing: true });
        UploadActionCreators.addFiles(
          event.files,
          () => this.setState({ isProcessing: false }),
        );
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
    this.hideSidebar();
  },

  render() {
    let subtitle = '';
    const assembly = UploadStore.getAssembly(this.state.assemblyName);
    const { isProcessing } = this.state;

    switch (this.state.viewPage) {
    case 'assembly':
      subtitle = assembly && assembly.fasta.name;
      break;
    default: subtitle = isProcessing ? 'Processing...' : 'Overview';
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader subtitle={subtitle} activateUploadButton={this.state.readyToUpload} />

          <UploadWorkspaceNavigation assembliesUploaded={assembly ? true : false} totalAssemblies={this.state.numberOfAssemblies}>
            <footer className="wgsa-upload-navigation__footer mdl-shadow--4dp">
              <button type="button" title="Overview"
                className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={this.handleOverviewClick}>
                Overview
              </button>
              <button type="button" title="Add files"
                className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={this.handleClick}>
                Add Files
              </button>
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
