import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import MarkerLayer from 'react-leaflet-marker-layer';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MarkdownHeading from '../components/MarkdownHeading.react';
import Spinner from '../components/Spinner.react';
import { FormattedName } from '../organisms';

import { getShowcaseCollections } from './api';

const ATTRIBUTION = `
  Map data &copy;
  <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors
  <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>,
  Imagery © <a href='http://mapbox.com'>Mapbox</a>
`;

import CONFIG from '../app/config';

const Marker = React.createClass({

  render() {
    const { style, marker, selectedCollection, setCollection } = this.props;
    const { token, uuid = token } = marker.collection;
    return (
      <Link
        ref={el => { this.ref = el; }}
        style={{
          ...style,
          animationDelay: `${0.125 * marker.index}s`,
        }}
        to={`/collection/${uuid}`}
        className={classnames(
          'showcase__link', {
            'active wgsa-sonar-effect': selectedCollection === uuid,
            inactive: selectedCollection && selectedCollection !== uuid,
          })
        }
        onMouseEnter={() => setCollection(uuid)}
        onMouseLeave={() => setCollection(null)}
      />
    );
  },

});

const SelectedCollection = ({ collection }) => (
  <div className="wgsa-showcase-tooltip">
    <MarkdownHeading level="3">{collection.title}</MarkdownHeading>
    <p>{collection.size} <FormattedName fullName organismId={collection.organismId} /> genomes</p>
  </div>
);

export default React.createClass({

  getInitialState() {
    return {
      locations: [],
      collections: [],
      focus: false,
    };
  },

  componentDidMount() {
    getShowcaseCollections()
      .then(collections => this.setState({
        locations: collections.reduce((memo, { locations, ...collection }) => {
          for (const [ index, [ lat, lon ] ] of locations.entries()) {
            if (lat !== null && lon !== null) {
              memo.push({ lat, lon, collection, index });
            }
          }
          return memo;
        }, []),
        collections,
      }));
  },

  componentDidUpdate(_, previous) {
    const { collections } = this.state;
    if (previous.collections.length === 0 && collections.length > 0) {
      this.setCollection();
      this.startCarousel();
    }
  },

  componentWillUnmount() {
    this.stopCarousel();
  },

  setCollection() {
    const { collections } = this.state;
    const { token, uuid = token } = collections[Math.floor(Math.random() * collections.length)];
    this.setState({ uuid });
  },

  startCarousel() {
    this._interval = setInterval(this.setCollection, 5000);
  },

  stopCarousel() {
    clearInterval(this._interval);
  },

  renderCollectionLinks() {
    const { locations } = this.state;
    return (
      <MarkerLayer
        markers={locations}
        latitudeExtractor={_ => _.lat}
        longitudeExtractor={_ => _.lon}
        markerComponent={Marker}
        propsForMarkers={{
          selectedCollection: this.state.uuid,
          setCollection: uuid => {
            this.setState({ uuid });
            this.stopCarousel();
          },
        }}
      />
    );
  },

  render() {
    const { locations, uuid, collections } = this.state;
    return (
      <section className="showcase">
        <div className="wgsa-homepage__content">
          <Map
            animate={false}
            zoomControl={false}
            center={[ 44, 13.5 ]}
            zoom={2}
            minZoom={2}
            boundsOptions={{ animate: false }}
            scrollWheelZoom={false}
            onFocus={({ target }) => { target.scrollWheelZoom.enable(); }}
            onBlur={({ target }) => { target.scrollWheelZoom.disable(); }}
            onMoveend={({ target }) => { this.map = target; }}
            ref={map => { this.leafletMap = map; }}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              noWrap
              attribution={ATTRIBUTION}
              url={`https://api.mapbox.com/styles/v1/cgpsdev/cj5y3b7aq0rru2spdrcdnjxsm/tiles/256/{z}/{x}/{y}?access_token=${CONFIG.mapboxKey}`}
            />
            {this.renderCollectionLinks()}
          </Map>
          { locations.length === 0 && <Spinner singleColour /> }
          <ReactCSSTransitionGroup
            className="wgsa-showcase-tooltip-wrapper"
            transitionName="wgsa-showcase-tooltip"
            transitionEnterTimeout={280}
            transitionLeaveTimeout={280}
          >
            { !!uuid &&
              <SelectedCollection key={uuid} collection={collections.find(_ => _.token === uuid)} /> }
          </ReactCSSTransitionGroup>
        </div>
      </section>
    );
  },

});
