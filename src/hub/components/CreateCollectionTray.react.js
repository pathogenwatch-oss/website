import '../css/tray.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import * as selectors from '../selectors/create-collection';

import actions from '../actions';
import { createCollection } from '../thunks';

import { taxIdMap } from '../../species';

const CreateCollectionTray = React.createClass({

  getInitialState() {
    return {
      open: false,
    };
  },

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

  onHeaderClick() {
    this.setState({
      open: !this.state.open,
    });
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
      <ReactCSSTransitionGroup
        className="wgsa-tray-container"
        transitionName="wgsa-tray"
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
      { this.props.visible ?
        <aside key="create-collection-tray" className={classnames('wgsa-tray', { 'wgsa-tray--open': this.state.open })}>
          <header className="wgsa-tray__header" onClick={this.onHeaderClick}>
            Create Collection
            <button className="mdl-button mdl-button--icon">
              <i className="material-icons">{`expand_${this.state.open ? 'more' : 'less'}`}</i>
            </button>
          </header>
          <form className="wgsa-tray__content" onSubmit={this.props.onSubmit}>
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
            <div className="wgsa-tray-actions">
              <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
              >
                Create
              </button>
            </div>
          </form>
        </aside>
        : null
      }
      </ReactCSSTransitionGroup>
    );
  },

});

function mapStateToProps(state) {
  return {
    visible: selectors.canCreateCollection(state),
    collectionSummary: selectors.getCollectionSummary(state),
    metadata: selectors.getCollectionMetadata(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit:
      (e) => { e.preventDefault(); dispatch(createCollection()); },
    onFormChange:
      ({ target }) => dispatch(actions.changeCollectionMetadata(
        target.id.split('collection-')[1],
        target.value
      )),
  };
}

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

export default connectToStore(CreateCollectionTray);
