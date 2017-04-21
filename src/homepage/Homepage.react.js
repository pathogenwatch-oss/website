import React from 'react';
import { Link } from 'react-router';

import { FormattedName } from '../organisms';

export default React.createClass({

  render() {
    return (
      <div className="wgsa-homepage">
        <section className="jumbotron">
          <img src="/images/WGSA.FINAL.svg" alt="WGSA" />
          <h1>Global AMR surveillance through Whole Genome Sequencing</h1>
        </section>
        <section className="showcase">
          <img src="/images/worldmap.svg" />
          <Link className="showcase__link showcase__link--1 wgsa-sonar-effect" />
          <Link className="showcase__link showcase__link--2 showcase__link--large wgsa-sonar-effect" />
          <Link className="showcase__link showcase__link--3 showcase__link--small wgsa-sonar-effect" />
          <Link className="showcase__link showcase__link--4 wgsa-sonar-effect" />
          <Link className="showcase__link showcase__link--5 showcase__link--large wgsa-sonar-effect" />
          <Link className="showcase__link showcase__link--6 wgsa-sonar-effect" />
          <Link className="showcase__link showcase__link--7 showcase__link--small wgsa-sonar-effect" />
          <footer>
            <a href="#how-it-works" className="mdl-button mdl-button--primary">
              <i className="material-icons">expand_more</i> How it works
            </a>
          </footer>
        </section>
        <section id="how-it-works" className="alt">
          <div className="wgsa-homepage__content">
            <h2>How WGSA Works</h2>
            <ol>
              <li><h3>Upload</h3></li>
              <li><h3>Analyse</h3></li>
              <li><h3>Explore</h3></li>
            </ol>
          </div>
        </section>
        <section id="organisms">
          <div className="wgsa-homepage__content">
            <h2>Organisms</h2>
            <table className="wgsa-organism-table">
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
                  <th>MLST</th>
                  <th>PAARSNP</th>
                  <th>Population Search</th>
                  <th>Other</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><FormattedName organismId="1280" fullName /></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="90370" fullName /></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td>Genotyphi</td>
                </tr>
                <tr>
                  <td><FormattedName organismId="485" fullName /></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td>NG-MAST</td>
                </tr>
                <tr>
                  <td><FormattedName organismId="1313" fullName /></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="64320" fullName /></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="1646" fullName /></td>
                  <td><i className="material-icons">check_circle</i></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
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
                    <span className="wgsa-feature-figure">150</span>
                    <small>genomes per collection</small>
                  </td>
                  <td>
                    <span className="wgsa-feature-figure">2000</span>
                    <small>genomes per collection</small>
                  </td>
                </tr>
                <tr>
                  <td>&mdash;</td>
                  <td>Private genomes & collections</td>
                </tr>
                <tr>
                  <td>&mdash;</td>
                  <td>Publish collections to public data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer className="cgps-footer mdl-mega-footer">
          <div className="mdl-mega-footer--top-section">
            <div className="mdl-mega-footer--left-section">
              <img className="cgps-supporting-logo" src="images/cgps_logo.png" />
              <img className="cgps-supporting-logo" src="images/imperial.png" />
              <img className="cgps-supporting-logo" src="images/wellcome_trust.png" />
            </div>
            <div className="mdl-mega-footer--right-section">
              <a className="cgps-contact-link cgps-contact-link--twitter" target="_blank" href="https://www.twitter.com/TheCGPS">
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
