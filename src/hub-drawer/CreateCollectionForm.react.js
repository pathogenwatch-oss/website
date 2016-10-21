import React from 'react';
import { connect } from 'react-redux';

import * as selectors from './selectors';

import { createCollection, changeCollectionMetadata } from './actions';

import { taxIdMap } from '../species';

const CreateCollectionForm = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElements(this.formElements);
  },

  componentDidUpdate(previously) {
    if (!previously.visible && this.props.visible) {
      componentHandler.upgradeElements(this.formElements);
    }

    if (!previously.visible && this.props.visible && this.state.open) {
      this.firstInput.focus();
    }
  },

  addToFormElements(element) {
    if (!this.firstInput) {
      this.firstInput = element.querySelector('input');
    }
    this.formElements.push(element);
  },

  formElements: [],
  firstInput: null,

  render() {
    const { metadata: { title, description } } = this.props;
    const { speciesId, numAssemblies } = this.props.collectionSummary;
    return (
      <form className="wgsa-drawer__content wgsa-create-collection-form" onSubmit={this.props.onSubmit}>
        <dl className="wgsa-collection-summary">
          <dt>Species</dt>
          <dd>{taxIdMap.get(speciesId).formattedShortName}</dd>
          <dt>Assemblies</dt>
          <dd>{numAssemblies}</dd>
        </dl>
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
