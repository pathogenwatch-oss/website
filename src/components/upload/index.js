import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';

import FileDragAndDrop from './DragAndDrop.react';
import CircularProgress from '^/components/CircularProgress.react';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';
import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import AssemblyList from './navigation/AssemblyList.react';
import UploadReviewHeader from './UploadReviewHeader.react';
import Overview from './Overview.react';

import UploadActionCreators from '^/actions/UploadActionCreators';
import ToastActionCreators from '^/actions/ToastActionCreators';

import UploadStore from '^/stores/UploadStore';
import FileUploadingStore from '^/stores/FileUploadingStore';

import FileUtils from '^/utils/File';
import {
  bindNavigationEvents, unbindNavigationEvents,
  navigateToHome, handleBeforeUnload,
} from '^/utils/Navigation';

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

  displayName: 'UploadIndex',

  contextTypes: {
    history: React.PropTypes.object,
    router: React.PropTypes.object,
  },

  getInitialState() {
    return {
      readyToUpload: false,
      confirmedMultipleMetadataDrop: false,
      isProcessing: false,
      processingProgress: 0,
      assemblyName: null,
      collectionUrl: null,
    };
  },

  componentDidMount() {
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
    UploadStore.addChangeListener(this.handleUploadStoreChange);
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
    this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    bindNavigationEvents(this.handleNavigationChange);
  },

  componentWillUnmount() {
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
    unbindNavigationEvents();
  },

  routerWillLeave(nextLocation) {
    // return false to prevent a transition w/o prompting the user,
    // or return a string to allow the user to decide:
    if (FileUploadingStore.isUploading()) {
      return null;
    }

    return handleBeforeUnload();
  },

  hideSidebar() {
    if (this.menuButton.getAttribute('aria-expanded') === 'true') {
      this.menuButton.click();
    }
  },

  handleFileUploadingStoreChange() {
    const id = FileUploadingStore.getCollectionId();

    if (!id) {
      return;
    }

    unbindNavigationEvents();
    const path = `/${Species.nickname}/collection/${id}`;
    const { router } = this.context;
    router.push(path);
  },

  handleNavigationChange(assemblyName = null) {
    this.setState({ assemblyName });
    this.hideSidebar();
  },

  processFiles(files) {
    this.setState({ isProcessing: true, processingProgress: 0 });
    FileUtils.parseFiles(files, {
      progress: (percent) => this.setState({ processingProgress: percent }),
      complete: () => this.setState({ isProcessing: false }),
    });
  },

  confirmDuplicateOverwrite(files) {
    this.setState({
      confirmedMultipleMetadataDrop: true,
    });
    this.processFiles(files);
  },

  handleDrop(event) {
    const files = Array.from(event.files);
    if (files.length > 0) {
      if (!this.state.confirmedMultipleMetadataDrop && UploadStore.getAssembliesCount() > 0) {
        ToastActionCreators.showToast({
          message: 'Duplicate records will be overwritten.',
          action: {
            label: 'confirm',
            onClick: this.confirmDuplicateOverwrite.bind(this, files),
          },
          sticky: true,
        });
      } else {
        this.processFiles(files);
      }
      // allows the same file to be uploaded consecutively
      this.refs.fileInput.value = '';
    }
  },

  handleClick() {
    this.refs.fileInput.click();
  },

  handleFileInputChange(event) {
    this.handleDrop(event.target);
  },

  handleUploadStoreChange() {
    if (this.state.assemblyName && UploadStore.getAssembly(this.state.assemblyName) === null) {
      navigateToHome();
    } else {
      this.setState({ readyToUpload: UploadStore.isReadyToUpload() });
      this.hideSidebar();
    }
  },

  handleUploadButtonClick() {
    if (this.state.isWaiting) {
      return;
    }

    this.setState({ isWaiting: true });
    UploadActionCreators.getCollectionId();
  },

  render() {
    const assemblies = UploadStore.getAssemblies();
    const assembly = UploadStore.getAssembly(this.state.assemblyName);
    const { isProcessing, isWaiting } = this.state;
    const subtitle = assembly ? assembly.name : (isProcessing ? 'Processing...' : 'Overview');

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader
            subtitle={subtitle}
            activateUploadButton={this.state.readyToUpload}
            handleUploadButtonClick={this.handleUploadButtonClick}
          />
          <aside className="navigation-container mdl-layout__drawer mdl-shadow--3dp">
            <a className="uploadWorkspaceNavigationTitle" href="#">
              <span className="mdl-badge" style={{ margin: 0 }} data-badge={UploadStore.getAssembliesCount()}>Assemblies</span>
            </a>
            <AssemblyList assemblies={assemblies} selectedAssemblyName={this.state.assemblyName} />
            <button type="button" title="Add files"
              className="wgsa-upload-review-button wgsa-add-files-button mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-shadow--4dp"
              onClick={this.handleClick}
            >
              <i className="material-icons">add</i>
            </button>
          </aside>
          <main className="mdl-layout__content" style={layoutContentStyle}>
            <div id="loadingAnimation" style={isWaiting ? loadingAnimationStyleVisible : loadingAnimationStyleHidden} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            {(() => {
              if (isProcessing) {
                return (
                  <div className="wgsa-file-processing-progress" ref="progressWrapper">
                    <CircularProgress
                      radius={240}
                      percentage={this.state.processingProgress}
                    />
                  </div>
                );
              }

              if (assembly) {
                return (
                  <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--6-col wgsa-card-column">
                      <div className="wgsa-card mdl-shadow--2dp">
                        <div className="wgsa-card-heading">Assembly Statistics</div>
                        <div className="wgsa-card-content">
                          <AssemblyAnalysis metrics={assembly.metrics}/>
                        </div>
                      </div>
                    </div>
                    <div className="mdl-cell mdl-cell--6-col wgsa-card-column chart-card">
                      <div className="wgsa-card mdl-shadow--2dp">
                        <div className="wgsa-card-heading">N50 Chart</div>
                        <div className="wgsa-card-content ">
                          { assembly.metrics &&
                            <AssemblyAnalysisChart metrics={assembly.metrics} />
                          }
                        </div>
                      </div>
                    </div>
                    <div className="wgsa-card mdl-cell mdl-cell--12-col increase-cell-gutter mdl-shadow--2dp">
                      <div className="wgsa-card-heading">Metadata</div>
                      <div className="wgsa-card-content">
                        <AssemblyMetadata assembly={assembly} />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Overview
                  clickHandler={this.handleClick}
                  isReadyToUpload={this.state.readyToUpload}
                />
              );
            })()
          }
          </main>
        </div>
        <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />
      </FileDragAndDrop>
    );
  },
});
