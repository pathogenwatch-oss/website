import React from 'react';
import { Link } from 'react-router-dom';
import Leaflet from 'leaflet';

import { FormattedName } from '../organisms';
import Spinner from '../components/Spinner.react';

import { getShowcaseCollections } from './api';

import CONFIG from '../app/config';
const { maxCollectionSize = {} } = CONFIG;

function getCollectionSizeLimit(user) {
  const limit = maxCollectionSize[user] || 0;
  return limit === 0 ? 'Unlimited' : limit;
}

function get_xy(lat, lng){  //http://stackoverflow.com/questions/14329691/covert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
	var mapWidth=2058;
	var mapHeight=1746;
	var factor=.404;
	var x_adj=-391;
	var y_adj=37;
	// get x value
	var x = (mapWidth*(180+lng)/360)%mapWidth+(mapWidth/2);

	//convert from degrees to radians
	var latRad = lat*Math.PI/180;

	// get y value
	var mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2)));
	var y = (mapHeight/2)-(mapWidth*mercN/(2*Math.PI));
	return { x: x*factor+x_adj, y: y*factor+y_adj}
}

export default React.createClass({

  getInitialState() {
    return {
      collections: [],
    };
  },

  componentWillMount() {
    document.title = 'WGSA | Whole Genome Sequence Analysis';
    getShowcaseCollections()
      .then(collections => this.setState({ collections }));
  },

  renderCollectionLinks() {
    const { collections } = this.state;
    if (collections.length) {
      const div = document.createElement('div');
      div.style = { width: 640, height: 640 * 0.62 };
      var scale = 640/887;

      return collections.map(({ uuid, slug, size, centroid }, index) => {
        const point = get_xy(centroid.lat, centroid.lon);
        console.log(point, centroid, index);
        return (
          <Link
            key={uuid}
            to={`/collection/${slug}`}
            className="showcase__link wgsa-sonar-effect"
            style={{
              left: `${point.x * scale}px`,
              top: `${point.y * scale}px`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${0.25 * index}s`,
              width: Math.min(Math.max(8, size * 0.125), 32),
              height: Math.min(Math.max(8, size * 0.125), 32),
            }}
          />
        );
      });
    }
    return <Spinner singleColour />;
  },

  render() {
    return (
      <div className="wgsa-homepage">
        <section className="jumbotron">
          <img src="/images/WGSA.FINAL.svg" alt="WGSA" />
          <h1>Global AMR surveillance through Whole Genome Sequencing</h1>
        </section>
        <section className="showcase" style={{ width: 640, height: 480 }}>
          <img src="/images/mercator.svg" />
          {this.renderCollectionLinks()}
          {/* <Link to="#" className="showcase__link showcase__link--1 wgsa-sonar-effect" />
          <Link to="#" className="showcase__link showcase__link--2 showcase__link--large wgsa-sonar-effect" />
          <Link to="#" className="showcase__link showcase__link--3 showcase__link--small wgsa-sonar-effect" />
          <Link to="#" className="showcase__link showcase__link--4 wgsa-sonar-effect" />
          <Link to="#" className="showcase__link showcase__link--5 showcase__link--large wgsa-sonar-effect" />
          <Link to="#" className="showcase__link showcase__link--6 wgsa-sonar-effect" />
          <Link to="#" className="showcase__link showcase__link--7 showcase__link--small wgsa-sonar-effect" /> */}
          <footer>
            <a href="#how-it-works" className="mdl-button mdl-button--primary title-font">
              <i className="material-icons">expand_more</i> How it works
            </a>
          </footer>
        </section>
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
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="90370" fullName /></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><small>Genotyphi</small></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="485" fullName /></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><small>NG-MAST</small></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="1313" fullName /></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td><i className="material-icons">check</i></td>
                  <td></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="64320" fullName /></td>
                  <td><i className="material-icons">check</i></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td><FormattedName organismId="1646" fullName /></td>
                  <td><i className="material-icons">check</i></td>
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
