import React from 'react';

import { Link } from 'react-router';

import Species from '../species';
import { CGPS } from '../defaults';

const headingStyle = {
  color: CGPS.COLOURS.PURPLE,
};

const textStyle = {
  color: CGPS.COLOURS.PURPLE,
  textTransform: 'none',
};

const listStyle = {
  margin: 0,
  padding: 0,
};

const listItemStyle = {
  textAlign: 'center',
  listStyle: 'none',
  display: 'block',
  margin: '16px'
};

export default React.createClass({

  componentDidMount() {
    Species.list.map((speciesDef) => {
      var element = React.findDOMNode(this.refs[speciesDef.nickname]);
      element.style.backgroundImage = `url(${speciesDef.imagePath})`;
    });
  },

  render: function () {
    return (
      <section>
        <div className="wgsa-home-header mdl-layout__header-row mdl-shadow--2dp">
          <span style={headingStyle} className="mdl-layout-title">WGSA</span>
        </div>
        <div className="wgsa-species-list-container">
          { Species.list.map((speciesDef) => {
            return (
              <div className="wgsa-welcome-card-square mdl-card mdl-shadow--2dp">
                <div ref={speciesDef.nickname} className="mdl-card__title mdl-card--expand">
                </div>
                <div className="mdl-card__supporting-text">
                  {speciesDef.definitionText}
                </div>
                <div className="mdl-card__actions mdl-card--border">
                  <Link
                    to={`/${speciesDef.nickname}/upload`}
                    className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-shadow--4dp"
                    style={textStyle}>
                    {speciesDef.formattedName}
                  </Link>
                </div>
              </div>
            );
          }) }
        </div>
      </section>
    );
  },

});

