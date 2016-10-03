import '../css/tray.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { canCreateCollection, getCollectionSummary } from '../selectors/create-collection';

import { createCollection } from '../thunks';

const CreateCollectionTray = React.createClass({

  getInitialState() {
    return {
      open: true,
    };
  },

  onHeaderClick() {
    this.setState({
      open: !this.state.open,
    });
  },

  getClassname() {
    return `wgsa-tray ${this.state.open ? 'wgsa-tray--open' : ''}`.trim();
  },

  render() {
    const { species, numAssemblies } = this.props.collectionSummary;
    return (
      <ReactCSSTransitionGroup
        className="wgsa-tray-container"
        transitionName="wgsa-tray"
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
      { this.props.visible ?
        <aside key="create-collection-tray" className={this.getClassname()}>
          <header className="wgsa-tray__header" onClick={this.onHeaderClick}>
            Create Collection
            <button className="mdl-button mdl-button--icon">
              <i className="material-icons">{`expand_${this.state.open ? 'more' : 'less'}`}</i>
            </button>
          </header>
          <div className="wgsa-tray__content">
            <dl className="wgsa-collection-summary">
              <dt>Species</dt>
              <dd>{species.label}</dd>
              <dt>Num. Assemblies</dt>
              <dd>{numAssemblies}</dd>
            </dl>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input className="mdl-textfield__input" type="text" id="collection-name-input" />
              <label className="mdl-textfield__label" htmlFor="collection-name-input">Name</label>
            </div>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <textarea className="mdl-textfield__input" type="text" rows="3" id="collection-desc-input" ></textarea>
              <label className="mdl-textfield__label" htmlFor="collection-desc-input">Description</label>
            </div>
            <br />
            <button
              className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
              onClick={this.props.onButtonClick}
            >
              Create
            </button>
          </div>
        </aside>
        : null
      }
      </ReactCSSTransitionGroup>
    );
  },

});

function mapStateToProps(state) {
  return {
    visible: canCreateCollection(state),
    collectionSummary: getCollectionSummary(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onButtonClick: () => dispatch(createCollection()),
  };
}

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

export default connectToStore(CreateCollectionTray);
