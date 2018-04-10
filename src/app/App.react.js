import './styles.css';
import '../css/menu.css';
import '../css/forms.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Toast from '../toast';
import GenomeDetail from '../genomes/detail';

import Header from './Header.react';
import Content from './Content.react';

import { fetchSummary } from '../summary/actions';
import { locationChange } from '../location';
import { showIntroToast } from './actions';

function mapStateToProps({ location, header, branding }) {
  return {
    pageSlug: location.slug,
    userDrawerVisible: header.userDrawerVisible,
    brandingId: branding.id,
  };
}

function mapDispatchToProps(dispatch, { location }) {
  return {
    onLocationChange: () => dispatch(locationChange(location)),
    fetchSummary: () => dispatch(fetchSummary()),
    showIntroToast: () => dispatch(showIntroToast()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(React.createClass({

  propTypes: {
    children: React.PropTypes.element,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
    this.onLocationChange();
    this.props.fetchSummary();
    this.props.showIntroToast();
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
    console.log(e);
  },

  render() {
    const { pageSlug, userDrawerVisible, brandingId } = this.props;
    return (
      <div className="mdl-layout__container">
        <div ref="layout"
          className={classnames(
            'mdl-layout',
            `wgsa-page--${pageSlug}`,
            { 'user-drawer-visible': userDrawerVisible },
            `cgps-branding--${brandingId.toLowerCase()}`
          )}
        >
          <Header />
          <main className="mdl-layout__content">
            <Content />
          </main>
          <Toast />
          <GenomeDetail />
        </div>
      </div>
    );
  },

}));
