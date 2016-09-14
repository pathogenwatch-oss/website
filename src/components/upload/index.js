import '../../css/upload-review.css';
import '../../css/forms.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from './DragAndDrop.react';
import CircularProgress from '^/components/CircularProgress.react';

import AssemblyMetadata from './AssemblyMetadata.react';
import AssemblyAnalysis from './AssemblyAnalysis.react';
import AssemblyAnalysisChart from './AssemblyAnalysisChart.react';

import AssemblyList from './navigation/AssemblyList.react';
import UploadReviewHeader from './UploadReviewHeader.react';
import Overview from './Overview.react';

import { updateHeader } from '^/actions/header';
import UploadActionCreators from '^/actions/UploadActionCreators';
import ToastActionCreators from '^/actions/ToastActionCreators';

import UploadStore from '^/stores/UploadStore';
import FileUploadingStore from '^/stores/FileUploadingStore';

import FileUtils from '^/utils/File';
import {
  bindNavigationEvents, unbindNavigationEvents, navigateToHome,
} from '^/utils/Navigation';

import Species from '^/species';
import DEFAULT from '^/defaults';

const loadingAnimationStyleVisible = {
  visibility: 'visible',
};

const loadingAnimationStyleHidden = {
  visibility: 'hidden',
};

const fileInputStyle = {
  position: 'fixed',
  zIndex: -1,
  opacity: 0,
};

export default connect()(React.createClass({

  displayName: 'UploadIndex',

  contextTypes: {
    history: React.PropTypes.object,
    router: React.PropTypes.object,
  },

  getInitialState() {
    return {
      readyToUpload: UploadStore.isReadyToUpload(),
      confirmedMultipleMetadataDrop: false,
      isProcessing: false,
      processingProgress: 0,
      assemblyName: null,
      collectionUrl: null,
    };
  },

  componentWillMount() {
    this.props.dispatch(updateHeader({
      speciesName: Species.formattedName,
      classNames: 'mdl-shadow--3dp',
      content: (
        <UploadReviewHeader
          subtitle="overview"
          activateUploadButton={this.state.readyToUpload}
          handleUploadButtonClick={this.handleUploadButtonClick}
        />
      ),
    }));

    document.title = `WGSA | Create Collection`;
  },

  componentDidMount() {
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
    UploadStore.addChangeListener(this.handleUploadStoreChange);
    bindNavigationEvents(this.handleNavigationChange);
  },

  componentDidUpdate(_, previousState) {
    const assembly = UploadStore.getAssembly(this.state.assemblyName);
    const { isProcessing, readyToUpload } = this.state;

    if (isProcessing !== previousState.isProcessing ||
      readyToUpload !== previousState.readyToUpload) {
      this.props.dispatch(updateHeader({
        content: (
          <UploadReviewHeader
            subtitle={assembly ? assembly.name : (isProcessing ? 'Processing...' : 'Overview')}
            activateUploadButton={this.state.readyToUpload}
            handleUploadButtonClick={this.handleUploadButtonClick}
          />
        ),
      }));
    }
  },

  componentWillUnmount() {
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    unbindNavigationEvents();
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
    this.props.dispatch(updateHeader({
      content: (
        <UploadReviewHeader
          subtitle={assemblyName || 'Overview'}
          activateUploadButton={this.state.readyToUpload}
          handleUploadButtonClick={this.handleUploadButtonClick}
        />
      ),
    }));
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

  handleDrop(files) {
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
    }
  },

  handleClick() {
    this.refs.fileInput.click();
  },

  handleUploadStoreChange() {
    this.setState({ readyToUpload: UploadStore.isReadyToUpload() });

    if (this.state.assemblyName && UploadStore.getAssembly(this.state.assemblyName) === null) {
      navigateToHome();
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
    const { isProcessing, isWaiting, assemblyListOpen } = this.state;
    const subtitle = assembly ? assembly.name : (isProcessing ? 'Processing...' : 'Overview');

    return (
      <FileDragAndDrop onFiles={this.handleDrop} noAddButton>
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

          return (
            <div
              className="mdl-grid mdl-grid--no-spacing"
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
              onClick={() => this.setState({ assemblyListOpen: false })}
            >
              <aside className={
                `navigation-container wgsa-card mdl-cell mdl-cell--stretch mdl-shadow--3dp mdl-layout__drawer ${this.state.assemblyListOpen ? 'is-visible' : ''}`.trim()
              }>
                <a className="uploadWorkspaceNavigationTitle" href="#">
                  <span className={`mdl-badge ${UploadStore.isCollectionTooLarge() ? 'mdl-badge--error' : null}`.trim()} style={{ margin: 0 }} data-badge={UploadStore.getAssembliesCount()}>Assemblies</span>
                </a>
                <AssemblyList assemblies={assemblies} selectedAssemblyName={this.state.assemblyName} />
                <button type="button" title="Add files"
                  className="wgsa-upload-review-button wgsa-add-files-button mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-shadow--4dp"
                  onClick={this.handleClick}
                >
                  <i className="material-icons">add</i>
                </button>
                <div className="wgsa-navigation-container__btn">
                  <button
                    className="mdl-button mdl-shadow--3dp"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({ assemblyListOpen: !assemblyListOpen });
                    }}
                  >
                    <i className="material-icons">{ assemblyListOpen ? 'keyboard_arrow_left' : 'keyboard_arrow_right' }</i>
                  </button>
                </div>
              </aside>
              <div className="mdl-cell mdl-cell--stretch increase-cell-gutter" style={{ position: 'relative', overflowY: 'auto' }}>
                { assembly ?
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
                          { assembly.metrics ?
                            <AssemblyAnalysisChart metrics={assembly.metrics} /> :
                            <p className="mdl-card__supporting-text">(Fasta file not provided)</p>
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
                  </div> :
                  <Overview
                    isReadyToUpload={this.state.readyToUpload}
                  />
                }
              </div>
            </div>
          );
        })()}
      </FileDragAndDrop>
    );
  },
}));
