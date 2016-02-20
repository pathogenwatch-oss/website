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

    this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    this.bindHashEvents();
  },

  componentWillUnmount() {
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
    window.onhashchange = null;
    window.onbeforeunload = null;
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
    //TODO: reset selected assembly
    UploadWorkspaceNavigationActionCreators.navigateToAssembly('');
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

  bindHashEvents() {
    if (window.location.hash) {
      window.location.hash = '';
    }
    window.onhashchange = this.handleHashChange;
    window.onbeforeunload = this.handleBeforeUnload;
  },

  handleHashChange(event) {
    const hash = window.location.hash;
    if (!hash || hash === '' || hash === '#') {
      this.handleOverviewClick();
    } else {
      const re = /#assembly-(.+)/;
      const match = re.exec(hash);
      if (match && match.length === 2) {
        const assemblyName = match[1];
        //TODO: Must check that the assembly name is a valid one
        const assemblies = UploadStore.getAssemblies();
        if (assemblies[assemblyName]) {
          UploadWorkspaceNavigationActionCreators.navigateToAssembly(assemblyName);
        }
      } else {
        console.error(`407 Hash not found.`);
      }
    }
  },

  scrollToAssemblyLink(assemblyName, speed = 'fast') {
    const $link = $(`.assemblyListItem [href="#assembly-${assemblyName}"]`);
    const linkOffset = parseInt($link.offset().top);
    const $container = $('.wgsa-assembly-list-wrapper');
    const containerOffset = parseInt($container.offset().top);
    const scrollTop = $container.scrollTop();
    const height = $container.height();
    if (linkOffset < containerOffset) {
      $container.animate({ scrollTop: linkOffset - containerOffset + scrollTop }, speed);
    } else if (linkOffset > containerOffset + height - 40) {
      $container.animate({ scrollTop: linkOffset - containerOffset + scrollTop - height + 40 }, speed);
    }
  },

  handleBeforeUnload(event) {
    return 'Do you realy want to uload this page? :-(';
  },

  render() {
    let subtitle = '';
    const assemblies = UploadStore.getAssemblies();
    const assembly = UploadStore.getAssembly(this.state.assemblyName);
    const { isProcessing } = this.state;

    switch (this.state.viewPage) {
      case 'assembly':
        subtitle = assembly && assembly.fasta.name;
        break;
      default:
        subtitle = isProcessing ? 'Processing...' : 'Overview';
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer">
          <UploadReviewHeader subtitle={subtitle} activateUploadButton={this.state.readyToUpload} />

          <aside className="navigation-container mdl-layout__drawer mdl-shadow--3dp">
            <a className="uploadWorkspaceNavigationTitle" href="#">
              <span className="mdl-badge" style={{ margin: 0 }} data-badge={this.state.numberOfAssemblies}>Assemblies</span>
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
