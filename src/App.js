import './css/menu.css';

import React from 'react';
import { Link } from 'react-router';

import Header from './components/Header.react';
import Toast from './components/Toast.react';


import Staph from './species/saureus';

export default React.createClass({

  propTypes: {
    children: React.PropTypes.element,
    title: React.PropTypes.any,
    headerClassNames: React.PropTypes.string,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
  },

  render() {
    const { children } = this.props;
    return (
      <div className="mdl-layout mdl-js-layout">
        <Header />
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" />
          </span>
          <nav className="mdl-navigation" onClick={this.hideSidebar}>
            <Link className="mdl-navigation__link" to="/">
              <i className="material-icons">home</i>
              Home
            </Link>
            <Link className="mdl-navigation__link" to={`/${Staph.nickname}`}>
              <i className="material-icons">bug_report</i>
              <span>{Staph.shortFormattedName}</span>
            </Link>
            <Link className="mdl-navigation__link" to={`/${Staph.nickname}/upload`}>
              <i className="material-icons">cloud_upload</i>
              Create Collection
            </Link>
          </nav>
        </div>
        <main className="mdl-layout__content">
          {children}
        </main>
        <Toast />
      </div>
    );
  },

  hideSidebar() {
    if (this.menuButton.getAttribute('aria-expanded') === 'true') {
      this.menuButton.click();
    }
  },

});
