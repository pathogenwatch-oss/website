import React from 'react';
import UploadStore from '../../../stores/UploadStore';
import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';
import '../../../css/UploadReview.css';
import { List, ListItem, FontIcon } from 'material-ui';
import createThemeManager from 'material-ui/lib/styles/theme-manager';

const ThemeManager = createThemeManager();
const AssemblyList = React.createClass({

  getInitialState: function () {
    return {
      selectedOption: null
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentDidMount: function () {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  componentWillUnmount: function () {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  handleUploadWorkspaceNavigationStoreChange: function () {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getFileAssemblyId()
    });
  },

  getListOptionElements: function () {
    const fileAssemblyIds = UploadStore.getFileAssemblyIds();
    return fileAssemblyIds.map((fileAssemblyId) => {
      return (
        <ListItem onClick={this.handleSelectAssembly.bind(this, fileAssemblyId)} key={fileAssemblyId} fileAssemblyId={fileAssemblyId} primaryText={fileAssemblyId} rightIcon={<FontIcon className='material-icons' color='purple'>done</FontIcon>}></ListItem>
      );
    });
  },

  handleSelectAssembly: function (selectedFileAssemblyId) {
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
  },

  render: function () {
    const listOptionElements = this.getListOptionElements();
    return (
      <List value={this.state.selectedOption}>
        {listOptionElements}
      </List>
    );
  }
});

module.exports = AssemblyList;
      // <select size={listOptionElements.length} className="assemblyListSelectInput form-control" value={this.state.selectedOption} onChange={this.handleSelectAssembly}>
      //   {listOptionElements}
      // </select>
