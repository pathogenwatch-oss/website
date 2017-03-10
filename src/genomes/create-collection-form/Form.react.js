import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { CardMetadata } from '../../card';

import * as selectors from './selectors';

import { createCollection, changeCollectionMetadata } from './actions';

import { taxIdMap } from '../../organisms';

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
    const { metadata: { title, description }, canCreateCollection } = this.props;
    const { organismId, numGenomes } = this.props.collectionSummary;

    if (!organismId) return null; // Prevent form erroring when organism not supplied
    return (
      <form className="wgsa-create-collection-form" onSubmit={this.props.onSubmit}>
        <span className="wgsa-card-metadata-inliner wgsa-collection-summary">
          <CardMetadata title="Organisms" icon="bug_report">
            {taxIdMap.get(organismId).formattedShortName}
          </CardMetadata>
          <CardMetadata icon="insert_drive_file">
            {numGenomes} Genome{numGenomes > 1 ? 's' : ''}
          </CardMetadata>
        </span>
        <div ref={this.addToFormElements} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            className="mdl-textfield__input"
            type="text"
            id="collection-title"
            value={title}
            onChange={this.props.onFormChange}
            disabled={!canCreateCollection}
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
            disabled={!canCreateCollection}
          />
          <label className="mdl-textfield__label" htmlFor="collection-description">Description</label>
        </div>
        <div className="wgsa-drawer-actions">
          <button
            className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
            disabled={!canCreateCollection}
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
    canCreateCollection: selectors.canCreateCollection(state),
    collectionSummary: selectors.getCollectionSummary(state),
    metadata: selectors.getCollectionMetadata(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit:
      (e) => {
        e.preventDefault();
        dispatch(createCollection())
          .then(({ slug }) => {
            if (slug) {
              browserHistory.push(`/collection/${slug}`);
            } else {
              console.error('Failed to create collection');
            }
          });
      },
    onFormChange:
      ({ target }) => dispatch(changeCollectionMetadata(
        target.id.split('collection-')[1],
        target.value
      )),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(CreateCollectionForm);
