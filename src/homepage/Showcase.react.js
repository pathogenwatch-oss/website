import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import MarkerLayer from 'react-leaflet-marker-layer';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Spinner from '../components/Spinner.react';

import { getShowcaseCollections } from './api';

const ATTRIBUTION = `
  Map data &copy;
  <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors,
  <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>,
  Imagery © <a href='http://mapbox.com'>Mapbox</a>
`;

import CONFIG from '../app/config';

const Marker = React.createClass({

  render() {
    const { style, marker, selectedCollection, setCollection } = this.props;
    const { uuid } = marker.collection;
    return (
      <Link
        style={{ ...style, animationDelay: `${0.125 * marker.index}s` }}
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

export default React.createClass({

  getInitialState() {
    return {
      locations: [],
      collections: [],
      focus: false,
    };
  },

  componentWillMount() {
    getShowcaseCollections()
      .then(collections => this.setState({
        locations: collections.reduce((memo, { locations, ...collection }) => {
          for (const [ index, { lat, lon } ] of locations.entries()) {
            memo.push({ lat, lon, collection, index });
          }
          return memo;
        }, []),
        collections,
      }));
  },

  startCarousel() {
    const { collections } = this.state;
    this._interval = setInterval(() => {
      const { uuid } = collections[Math.floor(Math.random() * collections.length)];
      this.setState({ uuid });
    }, 1000);
  },

  stopCarousel() {
    clearInterval(this._interval);
  },

  componentDidUpdate(_, previous) {
    const { collections } = this.state;

    if (previous.collections.length === 0 && collections.length > 0) {
      this.startCarousel();
    }
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
    const { locations } = this.state;
    return (
      <section className="showcase">
        <div className="showcase-curvature" />
        { locations.length === 0 && <Spinner singleColour /> }
        <Map
          animate={false}
          zoomControl={false}
          center={[ 35, 13.5 ]}
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
            url={`https://api.mapbox.com/styles/v1/cgpsdev/cj5y18lnc0vrl2rpjce4mhjv3/tiles/256/{z}/{x}/{y}?access_token=${CONFIG.mapboxKey}`}
          />
          {this.renderCollectionLinks()}
        </Map>
      </section>
    );
  },

});
