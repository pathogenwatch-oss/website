import React from 'react';
import { connect } from 'react-redux';

import { CardMetadata } from '../card';

import * as selectors from './selectors';

import { createCollection, changeCollectionMetadata } from './actions';

import { taxIdMap } from '../species';

const CreateCollectionForm = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElements(Array.from(this.formElements));
  },

  componentDidUpdate(previously) {
    if (!previously.open && this.props.open) {
      this.firstInput.focus();
    }
  },

  addToFormElements(element) {
    if (!this.firstInput) {
      this.firstInput = element.querySelector('input');
    }
    if (!this.formElements.has(element)) {
      this.formElements.add(element);
    }
  },

  formElements: new Set(),
  firstInput: null,

  render() {
    const { metadata: { title, description } } = this.props;
    const { speciesId, numAssemblies } = this.props.collectionSummary;

    if (!speciesId) return null; // Prevent form erroring when species not supplied
    return (
      <form className="wgsa-drawer__content wgsa-create-collection-form" onSubmit={this.props.onSubmit}>
        <span className="wgsa-card-metadata-inliner wgsa-collection-summary">
          <CardMetadata title="Species" icon="bug_report">
            {taxIdMap.get(speciesId).formattedShortName}
          </CardMetadata>
          <CardMetadata icon="insert_drive_file">
            {numAssemblies} assemblies
          </CardMetadata>
        </span>
        <div ref={this.addToFormElements} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            className="mdl-textfield__input"
            type="text"
            id="collection-title"
            value={title}
            onChange={this.props.onFormChange}
          />
          <label className="mdl-textfield__label" htmlFor="collection-title">Title</label>
        </div>
        <div ref={this.addToFormElements} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <textarea
            className="mdl-textfield__input"
            type="text"
            rows="3"
            id="collection-description"
            value={description}
            onChange={this.props.onFormChange}
          />
          <label className="mdl-textfield__label" htmlFor="collection-description">Description</label>
        </div>
        <div className="wgsa-drawer-actions">
          <button
            className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
          >
            Create
          </button>
        </div>
      </form>
    );
  },

});

function mapStateToProps(state) {
  return {
    collectionSummary: selectors.getCollectionSummary(state),
    metadata: selectors.getCollectionMetadata(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit:
      (e) => { e.preventDefault(); dispatch(createCollection()); },
    onFormChange:
      ({ target }) => dispatch(changeCollectionMetadata(
        target.id.split('collection-')[1],
        target.value
      )),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(CreateCollectionForm);
