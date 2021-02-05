import './styles.css';
import '../css/menu.css';
import '../css/forms.css';

import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Toast from '../toast';
import GenomeReport from '../genome-report';
import LocalStorage from './LocalStorage.react';
import Header from './Header.react';
import Content from './Content.react';
import Cookies from './Cookies.react';
import UserDrawer from '../header/UserDrawer.react';

import { fetchSummary } from '../summary/actions';
import { locationChange } from '../location';
import { showIntroToast } from './actions';

function mapStateToProps({ location, header }) {
  return {
    pageSlug: location.slug,
    userDrawerVisible: header.userDrawerVisible,
  };
}

function mapDispatchToProps(dispatch, { location }) {
  return {
    onLocationChange: () => dispatch(locationChange(location)),
    fetchSummary: () => dispatch(fetchSummary()),
    showIntroToast: () => dispatch(showIntroToast()),
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(React.createClass({

  propTypes: {
    children: React.PropTypes.element,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
    this.onLocationChange();
    this.props.fetchSummary();
    // this.props.showIntroToast();
  },

  componentDidUpdate(previous) {
    if (this.props.location !== previous.location) {
      this.onLocationChange();
    }
  },

  onLocationChange() {
    const { location, history } = this.props;
    if (navigator.onLine || /^\/(offline|collection\/)/.test(location.pathname)) {
      this.props.onLocationChange();
    } else if (location.pathname !== '/offline') {
      history.replace('/offline');
    }
  },

  componentDidCatch(e) {
    console.error(e);
  },

  render() {
    const { pageSlug, userDrawerVisible } = this.props;
    return (
      <div className="mdl-layout__container">
        <div ref="layout"
          className={classnames(
            'mdl-layout',
            `wgsa-page--${pageSlug}`,
            { 'user-drawer-visible': userDrawerVisible },
          )}
        >
          <Header />
          <main className="mdl-layout__content">
            <Content />
          </main>
          <UserDrawer visible={userDrawerVisible} />
          <Toast />
          <GenomeReport />
          <LocalStorage />
          <Cookies />
        </div>
      </div>
    );
  },

}));

export default hot(module)(App);
