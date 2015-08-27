import React from 'react';

import { Link } from 'react-router';

import Species from '../species';
import { CGPS } from '../defaults';

const textStyle = {
  color: CGPS.COLOURS.PURPLE,
};

const cardStyle = {
  background: CGPS.COLOURS.PURPLE,
  textDecoration: 'none',
};

export default React.createClass({

  render: function () {
    return (
      <div className="mdl-layout">
        <div className="mdl-grid">
          <h1 style={textStyle}>WGSA</h1>
        </div>
        <div className="mdl-grid">
          { Species.list.map((speciesDef) => {
            return (
              <div className="mdl-cell mdl-cell--6-col">
                <div className="mdl-card mdl-shadow--2dp">
                  <div className="mdl-card__title mdl-card--expand" style={cardStyle}></div>
                  <div className="mdl-card__actions mdl-card--border">
                    <Link
                      to={`/${speciesDef.nickname}/upload`}
                      className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                      style={textStyle}>
                      {speciesDef.name}
                    </Link>
                  </div>
                </div>
              </div>
            );
          }) }
        </div>
      </div>
    );
  },

});
