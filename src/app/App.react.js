import './styles.css';
import '../css/menu.css';
import '../css/forms.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Header from '../header';
import ConsentBanner from '../components/consent-banner';
import Toast from '../toast';
import GenomeDrawer from '../genome-drawer';

import { fetchSummary } from '../summary/actions';
import { locationChange } from '../location';

function mapStateToProps({ location }) {
  return {
    pageSlug: location.slug,
  };
}

function mapDispatchToProps(dispatch, { location }) {
  return {
    onLocationChange: () => dispatch(locationChange(location)),
    fetchSummary: () => dispatch(fetchSummary()),
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
  },

  componentDidUpdate(previous) {
    if (this.props.location !== previous.location) {
      this.onLocationChange();
    }
  },

  onLocationChange() {
    const { location, router } = this.props;
    if (/^\/(offline|collection\/)/.test(location.pathname) || navigator.onLine) {
      this.props.onLocationChange();
    } else if (location.pathname !== '/offline') {
      router.push('/offline');
    }
  },

  render() {
    const { routes } = this.props;
    const { header } = routes[routes.length - 1];
    return (
      <div className="mdl-layout__container">
        <div ref="layout"
          className={classnames(
            'mdl-layout',
            `wgsa-page--${this.props.pageSlug}`,
          )}
        >
          <Header content={header} />
          <main className="mdl-layout__content">
            {this.props.children}
          </main>
          <Toast />
          <GenomeDrawer />
        </div>
        <ConsentBanner />
      </div>
    );
  },

}));
