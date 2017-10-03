import React from 'react';
import { Link } from 'react-router-dom';

import { FormattedName } from '../organisms';
import Showcase from './Showcase.react';

import CONFIG from '../app/config';
const { maxCollectionSize = {} } = CONFIG;

function getCollectionSizeLimit(user) {
  const limit = maxCollectionSize[user] || 0;
  return limit === 0 ? 'Unlimited' : limit;
}

export default React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Whole Genome Sequence Analysis';
  },

  render() {
    const { deployedOrganisms } = this.props;
    return (
      <div className="wgsa-homepage">
        <section className="jumbotron">
          <img src="/images/WGSA.FINAL.svg" alt="WGSA" />
          <h1>Global AMR surveillance through Whole Genome Sequencing</h1>
        </section>
        <Showcase />
        <section id="how-it-works" className="alt wgsa-how-it-works">
          <div className="wgsa-homepage__content">
            <h2>How WGSA Works</h2>
            <ol>
              <li>
                <i className="material-icons">cloud_upload</i>
                <h3>Upload</h3>
                <p>Upload genome assemblies and metadata, or view all publicly available genomes.</p>
              </li>
              <li>
                <i className="material-icons">settings</i>
                <h3>Analyse</h3>
                <p>Generate results including MLST, AMR predictions, clustering of genomes, and interactive visualisation of metadata.</p>
              </li>
              <li>
                <i className="material-icons">find_in_page</i>
                <h3>Explore</h3>
                <p>Compare results with publicly available genomes within a species reference tree.</p>
              </li>
            </ol>
          </div>
        </section>
        <section id="organisms">
          <div className="wgsa-homepage__content">
            <h2>Organisms</h2>
            <p className="lead">
              WGSA provides species and taxonomy prediction for over 60,000 variants of bacteria, viruses and fungi, and basic quality metrics for assemblies.
            </p>
            <p className="lead">
              <strong>MLST</strong> prediction is available for over 100 species, and <strong>Core Genome MLST</strong> (cgMLST) is available for 6 species.
            </p>
            <table className="wgsa-organism-table">
              <caption>Detailed Analyses</caption>
              <colgroup>
                <col className="wgsa-title-column" />
                <col className="wgsa-feature-column" />
                <col className="wgsa-feature-column" />
                <col className="wgsa-feature-column" />
                <col className="wgsa-feature-column" />
                <col className="wgsa-feature-column" />
              </colgroup>
              <thead>
                <tr>
                  <th>Organism</th>
                  <th>Core Genome</th>
                  {/* <th>MLST</th> */}
                  <th>AMR Prediction</th>
                  <th>Population Search</th>
                  <th>Other</th>
                </tr>
              </thead>
              <tbody>
                { deployedOrganisms.has('1280') &&
                  <tr>
                    <td><FormattedName organismId="1280" fullName /></td>
                    <td><i className="material-icons">check</i></td>
                    {/* <td><i className="material-icons">check</i></td> */}
                    <td><i className="material-icons">check</i></td>
                    <td><i className="material-icons">check</i></td>
                    <td></td>
                  </tr> }
                { deployedOrganisms.has('90370') &&
                  <tr>
                    <td><FormattedName organismId="90370" fullName /></td>
                    <td><i className="material-icons">check</i></td>
                    {/* <td><i className="material-icons">check</i></td> */}
                    <td><i className="material-icons">check</i></td>
                    <td><i className="material-icons">check</i></td>
                    <td><small>Genotyphi</small></td>
                  </tr> }
                { deployedOrganisms.has('485') &&
                  <tr>
                    <td><FormattedName organismId="485" fullName /></td>
                    <td><i className="material-icons">check</i></td>
                    {/* <td><i className="material-icons">check</i></td> */}
                    <td><i className="material-icons">check</i></td>
                    <td><i className="material-icons">check</i></td>
                    <td><small>NG-MAST</small></td>
                  </tr> }
                { deployedOrganisms.has('1313') &&
                  <tr>
                    <td><FormattedName organismId="1313" fullName /></td>
                    <td><i className="material-icons">check</i></td>
                    {/* <td><i className="material-icons">check</i></td> */}
                    <td><i className="material-icons">check</i></td>
                    <td><i className="material-icons">check</i></td>
                    <td></td>
                  </tr> }
                { deployedOrganisms.has('64320') &&
                  <tr>
                    <td><FormattedName organismId="64320" fullName /></td>
                    <td><i className="material-icons">check</i></td>
                    {/* <td></td> */}
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr> }
                { deployedOrganisms.has('1646') &&
                  <tr>
                    <td><FormattedName organismId="1646" fullName /></td>
                    <td><i className="material-icons">check</i></td>
                    {/* <td></td> */}
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr> }
              </tbody>
            </table>
          </div>
          <footer>
            <Link to="/organisms" className="mdl-button mdl-button--primary">
              <i className="material-icons">bug_report</i> Browse Organisms
            </Link>
          </footer>
        </section>
        <section id="features" className="alt">
          <div className="wgsa-homepage__content">
            <h2>Features</h2>
            <table className="wgsa-features-table">
              <colgroup>
                <col />
                <col />
              </colgroup>
              <thead>
                <tr className="title-font">
                  <th>Anonymous User</th>
                  <th>Signed-in User</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Access public genomes</td>
                  <td>Access public genomes</td>
                </tr>
                <tr>
                  <td>
                    Save collections for offline use
                    <br />
                    <Link to="/offline">
                      <small>Find out more</small>
                    </Link>
                  </td>
                  <td>
                    Save collections for offline use
                    <br />
                    <Link to="/offline">
                      <small>Find out more</small>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="wgsa-feature-figure">{getCollectionSizeLimit('anonymous')}</span>
                    <small>genomes per collection</small>
                  </td>
                  <td>
                    <span className="wgsa-feature-figure">{getCollectionSizeLimit('loggedIn')}</span>
                    <small>genomes per collection</small>
                  </td>
                </tr>
                <tr>
                  <td>&mdash;</td>
                  <td>Persistent genomes & collections</td>
                </tr>
                {/* <tr>
                  <td>&mdash;</td>
                  <td>Publish collections to public data</td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <footer>
            { CONFIG.user ?
              <Link to="/account" className="mdl-button mdl-button--primary">
                <i className="material-icons">account_box</i> Go to Account
              </Link> :
              <button onClick={this.props.openMenu} className="mdl-button mdl-button--primary">
                <i className="material-icons">account_circle</i> Sign in
              </button> }
          </footer>
        </section>
        <footer className="cgps-footer mdl-mega-footer">
          <div className="mdl-mega-footer--top-section">
            <div className="mdl-mega-footer--left-section">
              <a href="http://www.pathogensurveillance.net" target="_blank" rel="noopener">
                <img className="cgps-supporting-logo" src="images/cgps_logo.png" />
              </a>
              <img className="cgps-supporting-logo" src="images/imperial.png" />
              <img className="cgps-supporting-logo" src="images/wellcome_trust.png" />
            </div>
            <div className="mdl-mega-footer--right-section">
              <a className="cgps-contact-link cgps-contact-link--twitter" target="_blank" rel="noopener" href="https://www.twitter.com/TheCGPS">
                <i className="cgps-contact-link__icon"></i>@<span>TheCGPS</span>
              </a>
              <a className="cgps-contact-link cgps-contact-link--email" href="mailto:info@pathogensurveillance.net"><i className="material-icons cgps-contact-link__icon">mail_outline</i><span>info@pathogensurveillance.net</span></a>
            </div>
          </div>
          <div className="mdl-mega-footer--middle-section">
            <p className="mdl-typography--font-light cgps-copyright">© 2016 Centre for Genomic Pathogen Surveillance</p>
          </div>
        </footer>
      </div>
    );
  },

});
