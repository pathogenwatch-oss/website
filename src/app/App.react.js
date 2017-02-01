import './styles.css';
import '../css/menu.css';
import '../css/forms.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Header from '../header';
import Toast from '../toast';
import GenomeDrawer from '../genome-drawer';

import { locationChange } from '../location';

function mapStateToProps({ location }) {
  return {
    pageSlug: location.slug,
  };
}

function mapDispatchToProps(dispatch, { location }) {
  return {
    onLocationChange: () => dispatch(locationChange(location)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(React.createClass({

  propTypes: {
    children: React.PropTypes.element,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
    this.props.onLocationChange();
  },

  componentDidUpdate(previous) {
    if (this.props.location !== previous.location) {
      this.props.onLocationChange();
    }
  },

  render() {
    const { routes } = this.props;
    const { header } = routes[routes.length - 1];
    return (
      <div className="mdl-layout__container has-scrolling-header">
        <div ref="layout"
          className={classnames(
            'mdl-layout mdl-layout--fixed-header',
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
      </div>
    );
  },

}));
