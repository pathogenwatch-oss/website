import React from 'react';
import css from '../../../css/UploadReview.css';

import { ListItem, FontIcon } from 'material-ui';
import createThemeManager from 'material-ui/lib/styles/theme-manager';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';

const ThemeManager = createThemeManager();

const Component = React.createClass({
  propTypes: {
    fileAssemblyId: React.PropTypes.string.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  handleSelectAssembly: function (event) {
    console.log(event.target.value);
    var selectedFileAssemblyId = event.target.value;
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
  },

  render: function () {
    return (
      <ListItem onClick={this.handleSelectAssembly} value={this.props.fileAssemblyId} primaryText={this.props.fileAssemblyId} rightIcon={<FontIcon className='material-icons' color='purple'>done</FontIcon>}></ListItem>
    );
  }
});

module.exports = Component;
      // <option className='assemblyListOption' value={this.props.fileAssemblyId}>
      //   {this.props.fileAssemblyId}
      // </option>
