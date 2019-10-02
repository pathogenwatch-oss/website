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
    <DocumentTitle>A Global Platform for Genomic Surveillance</DocumentTitle>
    <section className="jumbotron">
      <div className="jumbotron-content">
        <Logo />
        <h1>
          A <strong>Global Platform</strong> for{' '}
          <strong>Genomic&nbsp;Surveillance</strong>.
        </h1>
      </div>
    </section>
    <Showcase />
    <section id="how-it-works" className="alt wgsa-how-it-works">
      <div className="wgsa-homepage__content">
        <h2>
          How <Name /> Works
        </h2>
        <ol>
          <li>
            <i className="material-icons">file_upload</i>
            <h3>Upload</h3>
            <p>
              Upload genome assemblies and metadata, or view all publicly
              available genomes.
            </p>
          </li>
          <li>
            <i className="material-icons">settings</i>
            <h3>Analyse</h3>
            <p>
              Generate results including MLST, AMR predictions, clustering of
              genomes, and interactive visualisation of metadata.
            </p>
          </li>
          <li>
            <i className="material-icons">search</i>
            <h3>Explore</h3>
            <p>
              Compare results with publicly available genomes within a species
              reference tree.
            </p>
          </li>
        </ol>
      </div>
    </section>
    <section id="organisms">
      <div className="wgsa-homepage__content">
        <h2>Organisms</h2>
        <p className="lead">
          <strong>
            <Name />
          </strong>{' '}
          provides species and taxonomy prediction for over 60,000 variants of
          bacteria, viruses, and fungi.
        </p>
        <p className="lead">
          <strong>MLST</strong> prediction is available for over 100 species
          using schemes from <a href="https://pubmlst.org/">PubMLST</a>,{' '}
          <a href="http://bigsdb.pasteur.fr/">Pasteur</a>, and{' '}
          <a href="http://enterobase.warwick.ac.uk">Enterobase</a>.
        </p>
        <p className="lead">
          <strong>cgMLST</strong> calling and clustering is available for the
          following schemes:
        </p>
        <ul className="pw-homepage-cgmlst-organisms">
          <li>
            <Link to="/genomes?genusId=469&speciesId=470">
              Acinetobacter baumannii
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=194&speciesId=195">
              Campylobacter coli
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=194&speciesId=197">
              Campylobacter jejuni
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=1350&speciesId=1352">
              Enterococcus faecium
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=561">Escherichia</Link>
          </li>
          <li>
            <Link to="/genomes?genusId=570&speciesId=573">
              Klebsiella pneumoniae
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=570&speciesId=1463165">
              Klebsiella quasipneumoniae
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=570&speciesId=244366">
              Klebsiella variicola
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=1637">Listeria</Link>
          </li>
          <li>
            <Link to="/genomes?genusId=1763&speciesId=33894">
              Mycobacterium africanum
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=1763&speciesId=1765">
              Mycobacterium bovis
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=1763&speciesId=78331">
              Mycobacterium canettii
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=1763&speciesId=1773">
              Mycobacterium tuberculosis
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=482&speciesId=485">
              Neisseria gonorrhoeae
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=482&speciesId=487">
              Neisseria meningitidis
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=590&speciesId=28901">
              Salmonella enterica
            </Link>
          </li>
          <li>
            <Link to="/genomes?genusId=620">Shigella</Link>
          </li>
          <li>
            <Link to="/genomes?genusId=1279&speciesId=1280">
              Staphylococcus aureus
            </Link>
          </li>
        </ul>
        <table className="wgsa-organism-table">
          <caption>Further Analyses</caption>
          <colgroup>
            <col className="wgsa-title-column" />
            <col className="wgsa-feature-column" />
            <col className="wgsa-feature-column" />
            <col className="wgsa-feature-column" />
            <col className="wgsa-feature-column" />
          </colgroup>
          <thead>
            <tr>
              <th>Organism</th>
              <th>AMR Prediction</th>
              <th>Collections</th>
              <th>Population Search</th>
              <th>Other</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <em>Klebsiella</em>
              </td>
              <td>
                <i className="material-icons">check</i>
              </td>
              <td />
              <td />
              <td>
                <small>Kleborate</small>
              </td>
            </tr>
            <tr>
              <td>
                <FormattedName organismId="573" />
              </td>
              <td>
                <i className="material-icons">check</i>
              </td>
              <td>
                {deployedOrganisms.has('573') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td />
              <td>
                <small>Kleborate</small>
              </td>
            </tr>
            <tr>
              <td>
                <FormattedName organismId="485" />
              </td>
              <td>
                <i className="material-icons">check</i>
              </td>
              <td>
                {deployedOrganisms.has('485') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td />
              <td>
                <small>NG-MAST</small>
              </td>
            </tr>
            {deployedOrganisms.has('1646') && (
              <tr>
                <td>
                  <FormattedName organismId="1646" />
                </td>
                <td />
                <td>
                  <i className="material-icons">check</i>
                </td>
                <td>
                  <i className="material-icons">check</i>
                </td>
                <td />
              </tr>
            )}
            <tr>
              <td>
                <em>Salmonella</em>
              </td>
              <td />
              <td />
              <td />
              <td>
                <small>SISTR</small>
              </td>
            </tr>
            <tr>
              <td>
                <FormattedName organismId="90370" />
              </td>
              <td>
                <i className="material-icons">check</i>
              </td>
              <td>
                {deployedOrganisms.has('90370') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td>
                {deployedOrganisms.has('90370') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td>
                <small>Genotyphi</small>
              </td>
            </tr>
            <tr>
              <td>
                <FormattedName organismId="1280" />
              </td>
              <td>
                <i className="material-icons">check</i>
              </td>
              <td>
                {deployedOrganisms.has('1280') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td>
                {deployedOrganisms.has('1280') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td />
            </tr>
            {deployedOrganisms.has('1336') && (
              <tr>
                <td>
                  <FormattedName organismId="1336" />
                </td>
                <td />
                <td>
                  <i className="material-icons">check</i>
                </td>
                <td />
                <td />
              </tr>
            )}
            <tr>
              <td>
                <FormattedName organismId="1313" />
              </td>
              <td>
                <i className="material-icons">check</i>
              </td>
              <td>
                {deployedOrganisms.has('1313') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td>
                {deployedOrganisms.has('1313') && (
                  <i className="material-icons">check</i>
                )}
              </td>
              <td>
                <small>PopPUNK</small>
                <br />
                <small>SeroBA</small>
              </td>
            </tr>
            {deployedOrganisms.has('64320') && (
              <tr>
                <td>
                  <FormattedName organismId="64320" />
                </td>
                <td />
                <td>
                  <i className="material-icons">check</i>
                </td>
                <td />
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer>
        <Link
          to="/genomes"
          className="mdl-button mdl-button--raised mdl-button--colored"
        >
          Browse Genomes
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
              <td>Upload genomes for analysis</td>
            </tr>
            <tr>
              <td>
                cgMLST clustering
                <br />
                <small>public genomes only</small>
              </td>
              <td>
                cgMLST clustering
                <br />
                <small>public and uploaded genomes</small>
              </td>
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
              <td>Access public collections</td>
              <td>
                Create collections of up to
                <br />
                <strong>{maxCollectionSize}</strong> genomes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer>
        {!!CONFIG.user ? (
          <Link
            to="/account"
            className="mdl-button mdl-button--raised mdl-button--colored"
          >
            Go to Account
          </Link>
        ) : (
          <SignInLink className="mdl-button mdl-button--raised mdl-button--colored">
            Sign in
          </SignInLink>
        )}
      </footer>
    </section>
    <footer className="mr-footer">
      <p>
        <span>Funded by </span>
        <img
          src="images/wellcome-logo-white.png"
          className="mr-footer-logo-square"
        />
      </p>
      <p>
        <span>Developed at </span>
        <img src="images/bdi.png" className="mr-footer-logo-square" />
        <img src="images/sanger.svg" className="mr-footer-logo" />
      </p>
      <p>
        <a
          href="https://www.pathogensurveillance.net"
          target="_blank"
          rel="noopener"
        >
          <img
            src="images/cgps-long-white.svg"
            className="mr-footer-logo-cgps"
          />
        </a>
      </p>
      <p className="cgps-copyright">
        © 2018 Centre for Genomic Pathogen Surveillance
      </p>
    </footer>
  </div>
);
