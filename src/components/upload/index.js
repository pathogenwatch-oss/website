import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';

import FileDragAndDrop from './DragAndDrop.react';

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

import { bindNavigationEvents, unbindNavigationEvents, navigateToHome } from '^/utils/Navigation';
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

  conponentName: 'UploadIndex',

  contextTypes: {
    history: React.PropTypes.object,
    router: React.PropTypes.object,
  },

  getInitialState() {
    return {
      readyToUpload: false,
      confirmedMultipleMetadataDrop: false,
      isProcessing: false,
      assemblyName: null,
      uploadProgressPercentage: 0,
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
    if (UploadStore.getAssembliesCount() > 0) {
      return 'By leaving this page, your collection will be lost. Continue?';
    }
  },

  hideSidebar() {
    if (this.menuButton.getAttribute('aria-expanded') === 'true') {
      this.menuButton.click();
    }
  },

  handleFileUploadingStoreChange() {
    this.setState({ isProcessing: true });
    const id = FileUploadingStore.getCollectionId();

    if (!id) {
      return;
    }

    const path = `/${Species.nickname}/collection/${id}`;
    const { history } = this.context;
    history.pushState(null, path);
  },

  handleNavigationChange(assemblyName = null) {
    this.setState({ assemblyName });
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
      if (!this.state.confirmedMultipleMetadataDrop && UploadStore.getAssembliesCount() > 0) {
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

  render() {
    const assemblies = UploadStore.getAssemblies();
    const assembly = UploadStore.getAssembly(this.state.assemblyName);
    const { isProcessing } = this.state;
    const subtitle = assembly ? assembly.fasta.name : (isProcessing ? 'Processing...' : 'Overview');

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader subtitle={subtitle} activateUploadButton={this.state.readyToUpload} />

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
            <div id="loadingAnimation" style={isProcessing ? loadingAnimationStyleVisible : loadingAnimationStyleHidden} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            { assembly ? (
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
              ) : (
               <Overview clickHandler={this.handleClick} isUploading={this.state.isUploading} isReadyToUpload={this.state.readyToUpload} />
             )
            }
          </main>
        </div>
        <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />
      </FileDragAndDrop>
    );
  },
});
