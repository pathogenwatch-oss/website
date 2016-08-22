import './style.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../components/upload/DragAndDrop.react';
import Overview from './Overview.react';
import FileGrid from './FileGrid.react';

import { updateHeader } from '^/actions/header';
import { uploadFasta } from './actions';
import ToastActionCreators from '../actions/ToastActionCreators';

import { uploadFastaUtil } from './utils';

const Specieator = React.createClass({

  propTypes: {
    fastas: React.PropTypes.object.isRequired,
    order: React.PropTypes.array.isRequired,
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

  upload(newFiles) {
    const { dispatch } = this.props;
    const duplicates = [];
    for (const file of newFiles) {
      if (this.props.fastas[file.name]) {
        duplicates.push(file.name);
        continue;
      }

      dispatch(uploadFasta(file.name, uploadFastaUtil(file, dispatch)));
    }

    if (duplicates.length) {
      ToastActionCreators.showToast({
        message: duplicates.length === 1 ? (
          <span><strong>{duplicates[0]}</strong> is a duplicate and was not queued.</span>
        ) : (
          <span>{duplicates.length} duplicates were not queued.</span>
        ),
      });
    }
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
  };
}

export default connect(mapStateToProps)(Specieator);
