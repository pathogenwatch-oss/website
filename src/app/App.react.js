import '../css/menu.css';
import '../css/forms.css';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Header from '../header';
import Toast from '../toast';
import DownloadsMenu from '../components/explorer/DownloadsMenu.react';

const MenuLink = ({ isActive, icon, text, link }) => (
  <Link className={`mdl-navigation__link ${isActive ? 'mdl-navigation__link--active' : ''}`.trim()} to={link}>
    <i className="material-icons">{icon}</i>
    <span>{text}</span>
  </Link>
);

const menuItems = [
  { icon: 'home',
    text: 'Home',
    link: '/',
  },
  { icon: 'cloud_upload',
    text: 'Create Collection',
    link: '/upload',
  },
];

function mapStateToProps({ bodyClickListener }) {
  return { bodyClickListener };
}

export default connect(mapStateToProps)(React.createClass({

  propTypes: {
    children: React.PropTypes.element,
    location: React.PropTypes.object,
    bodyClickListener: React.PropTypes.func,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
  },

  componentDidUpdate(previous) {
    if (this.props.location !== previous.location) {
      this.hideSidebar();
    }
  },

  hideSidebar() {
    if (this.menuButton.getAttribute('aria-expanded') === 'true') {
      this.menuButton.click();
    }
  },

  render() {
    const { location, bodyClickListener = () => {}, routes } = this.props;
    const { header } = routes[routes.length - 1];
    return (
      <div ref="layout" className="mdl-layout mdl-js-layout mdl-layout--fixed-header" onClick={bodyClickListener}>
        <Header content={header} />
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" />
          </span>
          <nav className="mdl-navigation" onClick={this.hideSidebar}>
            {menuItems.map(props => (
              <MenuLink key={props.link}
                isActive={location.pathname === props.link}
                {...props}
              />
            ))}
            <a className="mdl-navigation__link" target="_blank" rel="noopener" href="https://github.com/ImperialCollegeLondon/wgsa-documentation/wiki">
              <i className="material-icons">description</i>
              <span>Documentation</span>
            </a>
          </nav>
          <a className="cgps-logo" target="_blank" rel="noopener" href="http://www.pathogensurveillance.net">
            <img src="/assets/img/CGPS.SHORT.FINAL.svg" />
          </a>
          <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
        </div>
        <main className="mdl-layout__content">
          {this.props.children}
        </main>
        <DownloadsMenu />
        <Toast />
      </div>
    );
  },

}));
