import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import classnames from 'classnames';

import Spinner from '../components/Spinner.react';

import { getShowcaseCollections } from './api';

const ATTRIBUTION = `
  Map data &copy;
  <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors,
  <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>,
  Imagery © <a href='http://mapbox.com'>Mapbox</a>
`;

const viewport = [
  [ 70.5, 180 ],
  [ -56, -152 ],
];

import CONFIG from '../app/config';

export default React.createClass({

  getInitialState() {
    return {
      collections: [],
    };
  },

  componentWillMount() {
    getShowcaseCollections()
      .then(collections => this.setState({ collections }));
  },

  // renderCollectionLinks() {
  //   const { collections } = this.state;
  //   if (collections.length) {
  //     return collections.reduce((memo, { uuid, title, size, locations }) => {
  //       for (const { lat, lon } of locations) {
  //         memo.push(
  //           <Link
  //             key={`${uuid}_${lat}_${lon}`}
  //             to={`/collection/${uuid}`}
  //             className={classnames(
  //               'showcase__link', {
  //                 'active wgsa-sonar-effect': this.state.uuid === uuid,
  //                 inactive: this.state.uuid && this.state.uuid !== uuid,
  //               })
  //             }
  //             style={{
  //               left: `${point.x * scale}px`,
  //               top: `${point.y * scale}px`,
  //               transform: 'translate(-50%, -50%)',
  //               animationDelay: '0s',
  //             }}
  //             onMouseMove={() => this.setState({ uuid })}
  //             onMouseLeave={() => this.setState({ uuid: null })}
  //           />);
  //       }
  //       return memo;
  //     }, []);
  //   }
  //   return <Spinner singleColour />;
  // },

  render() {
    return (
      <section className="showcase">
        <div className="showcase-curvature" />
        <Map
          animate={false}
          zoomControl={false}
          // bounds={viewport}
          // maxBounds={viewport}
          center={[ 35, 13.5 ]}
          zoom={2}
          minZoom={2}
          boundsOptions={{ animate: false }}
          onMoveend={({ target }) => { this.map = target; }}
          ref={(map) => { this.leafletMap = map; }}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            noWrap
            attribution={ATTRIBUTION}
            url={`https://api.mapbox.com/styles/v1/cgpsdev/cj5xxcbvt0mie2rpb1sa27ezh/tiles/256/{z}/{x}/{y}?access_token=${CONFIG.mapboxKey}`}
          />
        </Map>
      </section>
    );

    // <section className="showcase" style={{ width: 640, height: 480 }}>
    //   <img src="/images/mercator.svg" />
    //   {this.renderCollectionLinks()}
    //   {/* <Link to="#" className="showcase__link showcase__link--1 wgsa-sonar-effect" />
    //   <Link to="#" className="showcase__link showcase__link--2 showcase__link--large wgsa-sonar-effect" />
    //   <Link to="#" className="showcase__link showcase__link--3 showcase__link--small wgsa-sonar-effect" />
    //   <Link to="#" className="showcase__link showcase__link--4 wgsa-sonar-effect" />
    //   <Link to="#" className="showcase__link showcase__link--5 showcase__link--large wgsa-sonar-effect" />
    //   <Link to="#" className="showcase__link showcase__link--6 wgsa-sonar-effect" />
    //   <Link to="#" className="showcase__link showcase__link--7 showcase__link--small wgsa-sonar-effect" /> */}
    //   <footer>
    //     <a href="#how-it-works" className="mdl-button mdl-button--primary title-font">
    //       <i className="material-icons">expand_more</i> How it works
    //     </a>
    //   </footer>
    // </section>
  },

});
