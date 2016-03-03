import './css/menu.css';

import React from 'react';

import Toast from './components/Toast.react';

import Staph from './species/saureus';

export default React.createClass({

  propTypes: {
    children: React.PropTypes.element,
    title: React.PropTypes.any,
    headerClassNames: React.PropTypes.string,
  },

  render() {
    const { children, title = 'Home', headerClassNames } = this.props;
    return (
      <div className="mdl-layout mdl-js-layout">
        <header className={`mdl-layout__header mdl-layout__header--scroll ${headerClassNames}`.trim()}>
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">{title}</span>
            <div className="mdl-layout-spacer"></div>
            <picture>
              <source srcSet="/assets/img/CGPS.FINAL.svg" media="(min-width: 1200px)" />
              <img className="cgps-logo" src="/assets/img/CGPS.SHORT.FINAL.svg" />
            </picture>
          </div>
        </header>
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Navigation</span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" href="/">WGSA Home</a>
            <a className="mdl-navigation__link" href="">{Staph.formattedName}</a>
            <a className="mdl-navigation__link" href="">Upload</a>
          </nav>
        </div>
        <main className="mdl-layout__content">
          {children}
        </main>
        <Toast />
      </div>
    );
  },

});
