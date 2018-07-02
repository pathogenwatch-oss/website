import React from 'react';
import { Link } from 'react-router-dom';

import { FormattedName } from '../organisms';
import Showcase from './Showcase.react';
import { Logo, Name } from '../branding';
import SignInLink from '../sign-in/SignInLink.react';

import CONFIG from '../app/config';
import DocumentTitle from '../branding/DocumentTitle.react';
const { maxCollectionSize = 1000 } = CONFIG;

export default ({ deployedOrganisms }) => (
  <div className="wgsa-homepage">
    <DocumentTitle>Global Pathogen Surveillance through Whole Genome Sequencing</DocumentTitle>
    <section className="jumbotron">
      <div className="jumbotron-content">
        <Logo />
        <h1><strong>Global Pathogen Surveillance</strong><br /> <span>through</span> Whole Genome Sequencing.</h1>
      </div>
    </section>
    <Showcase />
    <section id="how-it-works" className="alt wgsa-how-it-works">
      <div className="wgsa-homepage__content">
        <h2>How <Name /> Works</h2>
        <ol>
          <li>
            <i className="material-icons">file_upload</i>
            <h3>Upload</h3>
            <p>Upload genome assemblies and metadata, or view all publicly available genomes.</p>
          </li>
          <li>
            <i className="material-icons">settings</i>
            <h3>Analyse</h3>
            <p>Generate results including MLST, AMR predictions, clustering of genomes, and interactive visualisation of metadata.</p>
          </li>
          <li>
            <i className="material-icons">search</i>
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
          <strong><Name /></strong> provides species and taxonomy prediction for over 60,000 variants of bacteria, viruses, and fungi.
        </p>
        <p className="lead">
          <strong>MLST</strong> prediction is available for over 100 species using schemes from <a href="https://pubmlst.org/">PubMLST</a>, <a href="http://bigsdb.pasteur.fr/">Pasteur</a>, and <a href="http://enterobase.warwick.ac.uk">Enterobase</a>.
        </p>
        <table className="wgsa-organism-table">
          <caption>Further Analyses</caption>
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
              <th>cgMLST</th>
              <th>AMR Prediction</th>
              <th><Name /> Collections</th>
              <th>Population Search</th>
              <th>Other</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><em>Campylobacter coli</em></td>
              <td><i className="material-icons">check</i></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><em>Campylobacter jejuni</em></td>
              <td><i className="material-icons">check</i></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><em>Listeria</em></td>
              <td><i className="material-icons">check</i></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><FormattedName organismId="485" fullName /></td>
              <td><i className="material-icons">check</i></td>
              <td><i className="material-icons">check</i></td>
              <td>
                { deployedOrganisms.has('485') &&
                <i className="material-icons">check</i> }
              </td>
              <td></td>
              <td><small>NG-MAST</small></td>
            </tr>
            <tr>
              <td><em>Neisseria meningitidis</em></td>
              <td><i className="material-icons">check</i></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            { deployedOrganisms.has('1646') &&
              <tr>
                <td><FormattedName organismId="1646" fullName /></td>
                <td></td>
                <td></td>
                <td><i className="material-icons">check</i></td>
                <td></td>
                <td></td>
              </tr> }
            <tr>
              <td><FormattedName organismId="90370" fullName /></td>
              <td></td>
              <td><i className="material-icons">check</i></td>
              <td>
                { deployedOrganisms.has('90370') &&
                <i className="material-icons">check</i> }
              </td>
              <td>
                { deployedOrganisms.has('90370') &&
                <i className="material-icons">check</i> }
              </td>
              <td><small>Genotyphi</small></td>
            </tr>
            <tr>
              <td><FormattedName organismId="1280" fullName /></td>
              <td><i className="material-icons">check</i></td>
              <td><i className="material-icons">check</i></td>
              <td>
                { deployedOrganisms.has('1280') &&
                <i className="material-icons">check</i> }
              </td>
              <td>
                { deployedOrganisms.has('1280') &&
                <i className="material-icons">check</i> }
              </td>
              <td></td>
            </tr>
            <tr>
              <td><FormattedName organismId="1313" fullName /></td>
              <td></td>
              <td><i className="material-icons">check</i></td>
              <td>
                { deployedOrganisms.has('1313') &&
                <i className="material-icons">check</i> }
              </td>
              <td>
                { deployedOrganisms.has('1313') &&
                  <i className="material-icons">check</i> }
              </td>
              <td></td>
            </tr>
            { deployedOrganisms.has('64320') &&
              <tr>
                <td><FormattedName organismId="64320" fullName /></td>
                <td></td>
                <td></td>
                <td><i className="material-icons">check</i></td>
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
              <td />
              <td>
                Create collections of up to<br /><strong>{maxCollectionSize}</strong> genomes
              </td>
            </tr>
            <tr>
              <td />
              <td>
                Core genome clustering
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer>
        { !!CONFIG.user ?
          <Link to="/account" className="mdl-button mdl-button--primary">
            <i className="material-icons">account_circle</i> Go to Account
          </Link> :
          <SignInLink className="mdl-button mdl-button--primary">
            <i className="material-icons">account_circle</i> Sign in
          </SignInLink> }
      </footer>
    </section>
    <footer className="cgps-footer mdl-mega-footer">
      <div className="mdl-mega-footer--top-section">
        <div className="mdl-mega-footer--left-section">
          <img className="cgps-supporting-logo" src="images/wellcome-logo-white.png" />
          <img className="cgps-supporting-logo" src="images/bdi.png" />
          <a href="http://www.pathogensurveillance.net" target="_blank" rel="noopener">
            <img className="cgps-supporting-logo cgps-supporting-logo--cgps" src="images/cgps_logo.png" />
          </a>
        </div>
        <div className="mdl-mega-footer--right-section">
          <a className="cgps-contact-link cgps-contact-link--twitter" target="_blank" rel="noopener" href="https://www.twitter.com/Pathogenwatch">
            <i className="cgps-contact-link__icon"></i>@<span>Pathogenwatch</span>
          </a>
          <a className="cgps-contact-link cgps-contact-link--email" href="mailto:cgps@sanger.ac.uk"><i className="material-icons cgps-contact-link__icon">mail_outline</i><span>cgps@sanger.ac.uk</span></a>
        </div>
      </div>
      <div className="mdl-mega-footer--middle-section">
        <p className="mdl-typography--font-light cgps-copyright">© 2018 Centre for Genomic Pathogen Surveillance</p>
      </div>
    </footer>
  </div>
);
