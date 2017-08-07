import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../../drag-and-drop';
import Instructions from './Instructions.react';
import Summary from '../Summary.react';

import { addFiles } from './actions';

const Component = React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Upload';
  },

  render() {
    return (
      <FileDragAndDrop onFiles={this.props.onFiles}>
        <div className="wgsa-hipster-style wgsa-filterable-view">
          <Summary />
          <Instructions />
        </div>
      </FileDragAndDrop>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    onFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(null, mapDispatchToProps)(Component);
