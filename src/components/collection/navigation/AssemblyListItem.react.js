import React from 'react';
import css from '../../../css/upload-review.css';

import { ListItem, FontIcon } from 'material-ui';
import createThemeManager from 'material-ui/lib/styles/theme-manager';
import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';

const ThemeManager = createThemeManager();

const Component = React.createClass({
  propTypes: {
    fileAssemblyId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      selectedOption: null,
      deleteConfirm: null
    };
  },

  componentDidMount() {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  componentWillUnmount() {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  resetDeleteState() {
    this.setState({
      deleteConfirm: null
    });
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getFileAssemblyId()
    });
  },

  handleDeleteConfirm(fileAssemblyIdForDelete) {
    this.setState({
      deleteConfirm: fileAssemblyIdForDelete
    });
  },

  handleSelectAssembly(selectedFileAssemblyId) {
    this.resetDeleteState();
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
  },

  handleDeleteAssembly() {
    const currentAssemblyIdOnDisplay = UploadWorkspaceNavigationStore.getFileAssemblyId();
    if (currentAssemblyIdOnDisplay === this.props.fileAssemblyId) {
      var nextAssemblyIdForDisplay = UploadWorkspaceNavigationStore.getNextFileAssemblyIdOnDelete(this.props.fileAssemblyId);
      UploadWorkspaceNavigationActionCreators.navigateToAssembly(nextAssemblyIdForDisplay);
    }

    UploadWorkspaceNavigationActionCreators.deleteAssembly(this.props.fileAssemblyId);
  },

  render() {
    const fileAssemblyId = this.props.fileAssemblyId;
    const isValidMap = this.props.isValidMap;
    var validatedIconStyle = {
      color: '#888'
    };
    var validatedIcon = {
      icon: 'remove'
    };

    if (isValidMap) {
      if(isValidMap[fileAssemblyId]) {
        validatedIconStyle = { color: 'green' };
        validatedIcon = 'check';
      }
      else {
        validatedIconStyle = { color: 'red' };
        validatedIcon = 'error_outline';
      }
    }

    return (
      <li ref={fileAssemblyId} className={`assemblyListItem mdl-shadow--2dp${this.state.selectedOption === fileAssemblyId ? ' selected' : ''}`} title={fileAssemblyId}>
        { this.state.deleteConfirm ?
          <ConfirmDelete title={fileAssemblyId} handleDeleteAssembly={this.handleDeleteAssembly} resetDeleteState={this.resetDeleteState}/>
          :
          <div>
            <button className='selectButton mdl-button mdl-js-button mdl-js-ripple-effect' onClick={this.handleSelectAssembly.bind(this, fileAssemblyId)}>
            <span className='filename'>
                {fileAssemblyId}
              </span>
            </button>
            <span className="assembly-list-item__utils">
              <span className="assembly-list-item__validate-icon utilityButton">
                <i style={validatedIconStyle} className='material-icons'>{validatedIcon}</i>
              </span>
              <button className="deleteButton utilityButton mdl-button mdl-js-button mdl-button--icon mdl-button--colored"
                onClick={this.handleDeleteConfirm.bind(this, fileAssemblyId)}>
                <i className="material-icons">delete</i>
              </button>
            </span>
          </div>
        }
      </li>
    );
  }
});

var ConfirmDelete = React.createClass({

  render() {
    return (
      <div>
        <button className="confirm-delete-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent"
          title={"Confirm Delete - " + this.props.title}
          onClick={this.props.handleDeleteAssembly}>
          <i className="material-icons">delete</i>
        </button>
        <button className="confirm-delete-button mdl-button mdl-js-button mdl-js-ripple-effect"
          title="Cancel"
          onClick={this.props.resetDeleteState}>
          <i className="material-icons">clear</i>
        </button>
      </div>
    );
  }
})

module.exports = Component;
