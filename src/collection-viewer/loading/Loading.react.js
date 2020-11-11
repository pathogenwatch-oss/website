import './styles.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../../components/Spinner.react';
import { DocumentTitle, Logo } from '../../branding';

import { statuses } from '../constants';

import Organisms from '../../organisms';
import { CGPS } from '../../app/constants';

const backgroundStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
};

const Background = connect()(React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    const { logo = true } = this.props;
    return (
      <div style={backgroundStyle} className="wgsa-loading-container">
        <div className="wgsa-loading-content">
          {logo && <Logo className="wgsa-loading-logo" />}
          {this.props.children}
        </div>
      </div>
    );
  },

}));

export const LoadSpinner = React.createClass({

  displayName: 'LoadSpinner',

  render() {
    return (
      <Background logo={false}>
        <DocumentTitle>Loading...</DocumentTitle>
        <Spinner />
        <h1>Loading collection...</h1>
      </Background>
    );
  },

});

function getStatusMessage({ collection, location }) {
  const { status } = collection;
  if (status === statuses.NOT_FOUND) {
    const { organism } = location.state || {};
    if (organism) {
      return [
        <h1>Looking for an old collection?</h1>,
        <p className="mdl-typography--title">
          It will be available at <a
          href={`https://archive.wgsa.net/${organism}${location.pathname}`}>archive.wgsa.net</a> for a short time.
          <br />
          Please <a
          href={`mailto:pathogenwatch@cgps.group?subject=${encodeURIComponent('Data Migration')}`}>contact us</a> if you would like your data migrated to the new site.
        </p>,
      ];
    }
    return [
      <h1>We're sorry, this collection cannot be found.</h1>,
      <p className="mdl-typography--title">
        Please ensure that the address is correct, and if so, please try again later.</p>,
    ];
  }
  if (status === statuses.ABORTED) {
    return [
      <h1>We're sorry, your upload was interrupted</h1>,
      <p className="mdl-typography--title">
        Please upload your files again.
      </p>,
      <Link to={`/${Organisms.nickname}/upload`} className="mdl-button mdl-button--raised">Go Back</Link>,
    ];
  }

  return [
    <h1>We're sorry, something went wrong.</h1>,
    <button onClick={() => history.go(-1)} className="mdl-button mdl-button--raised">Go Back</button>,
  ];
}

export const LoadError = React.createClass({

  render() {
    return (
      <Background>
        <DocumentTitle>Error</DocumentTitle>
        {getStatusMessage(this.props)}
        <p>Please contact <a
          href={`mailto:pathogenwatch@cgps.group?subject=${encodeURIComponent('Upload Error')}&body=${encodeURIComponent('Please edit the section below as appropriate and include it in your message\nAffected URL - the URL of the query page if relevant.\nBrowser / Operating system / Time & Date\n')}`}
        >pathogenwatch@cgps.group</a> if problems persist.</p>
      </Background>
    );
  },
});
