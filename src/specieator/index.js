import './style.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../components/upload/DragAndDrop.react';
import Overview from './Overview.react';
import FileGrid from './FileGrid.react';

import { updateHeader } from '^/actions/header';

import { addFiles, uploadFile } from './utils';

const Specieator = React.createClass({

  propTypes: {
    fastas: React.PropTypes.object.isRequired,
    order: React.PropTypes.array.isRequired,
    uploads: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.props.dispatch(
      updateHeader({
        speciesName: 'Specieator',
        classNames: 'mdl-shadow--3dp',
        content: null,
      })
    );
  },

  componentDidUpdate() {
    const { uploads, fastas, dispatch } = this.props;
    const { queue, uploading } = uploads;
    if (queue.length && uploading.size < 5) {
      uploadFile(fastas[queue[0]], dispatch);
    }
  },

  upload(newFiles) {
    const { dispatch, fastas } = this.props;
    addFiles(newFiles, fastas, dispatch);
  },

  render() {
    const { fastas, order } = this.props;

    return (
      <FileDragAndDrop onFiles={this.upload}>
        { order.length ?
            <FileGrid files={order.map(name => fastas[name])} /> :
            <Overview />
        }
      </FileDragAndDrop>
    );
  },

});


function mapStateToProps({ specieator, entities }) {
  return {
    fastas: entities.fastas,
    order: specieator.fastaOrder,
    uploads: specieator.uploads,
  };
}

export default connect(mapStateToProps)(Specieator);
