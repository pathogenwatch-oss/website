import React from 'react';
import { connect } from 'react-redux';

import { CardMetadata } from '../../card';

import * as selectors from './selectors';

import { createCollection, changeCollectionMetadata } from './actions';

import { taxIdMap } from '../../organisms';
import { history } from '../../app/router';

const CreateCollectionForm = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElements(Array.from(this.formElements));
    this.firstInput.focus();
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
    const { metadata: { title, description, pmid }, canCreateCollection } = this.props;
    const { organismId, numGenomes } = this.props.collectionSummary;

    if (!organismId) return null; // Prevent form erroring when organism not supplied
    return (
      <form className="wgsa-create-collection-form" onSubmit={this.props.onSubmit}>
        <span className="wgsa-card-metadata-inliner wgsa-collection-summary">
          <CardMetadata title="Size" icon="wgsa_genome">
            <span>{numGenomes} Genome{numGenomes === 1 ? '' : 's'}</span>
          </CardMetadata>
          <CardMetadata title="Organism" icon="bug_report">
            {taxIdMap.get(organismId).formattedName}
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
            rows="4"
            id="collection-description"
            value={description}
            onChange={this.props.onFormChange}
            disabled={!canCreateCollection}
          />
          <label className="mdl-textfield__label" htmlFor="collection-description">Description</label>
        </div>
        <div
          ref={this.addToFormElements}
          className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label mdl-textfield--small"
        >
          <input
            className="mdl-textfield__input"
            type="text"
            id="collection-pmid"
            value={pmid}
            onChange={this.props.onFormChange}
            disabled={!canCreateCollection}
            pattern="[0-9]*"
          />
          <label className="mdl-textfield__label" htmlFor="collection-pmid">PMID</label>
        </div>
        <footer>
          <button
            className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
            disabled={!canCreateCollection}
          >
            Create Now
          </button>
        </footer>
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
          .then(({ token }) => {
            if (token) {
              history.push(`/collection/${token}`);
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
