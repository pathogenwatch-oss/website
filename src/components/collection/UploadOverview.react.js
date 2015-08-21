import React from 'react';
import '../../css/UploadReview.css';
import { Paper } from 'material-ui';
import createThemeManager from 'material-ui/lib/styles/theme-manager';

var Component = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  render: function () {
    return (
      <div className='uploadWorkspaceNavigationContainer'>
        <Paper zDepth={4} rounded={false}>
          {this.props.paperContent}
        </Paper>
      </div>
    );
  }
});

module.exports = Component;
