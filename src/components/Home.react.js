import React from 'react';

import { Link } from 'react-router';

import Species from '../species';
import { CGPS } from '../defaults';

const headingStyle = {
  color: CGPS.COLOURS.PURPLE,
  textAlign: 'center',
};

const textStyle = {
  color: CGPS.COLOURS.PURPLE,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  fontSize: '45px',
  lineHeight: '48px',
  height: 'calc(48px + 16px)',
  paddingTop: '8px',
  marginBottom: '16px',
  verticalAlign: 'middle',
};

const listStyle = {
  margin: 0,
  padding: 0,
};

const listItemStyle = {
  textAlign: 'center',
  listStyle: 'none',
  display: 'block',
};

export default React.createClass({

  render: function () {
    return (
      <section>
        <h1 style={headingStyle}>WGSA</h1>
        <ul style={listStyle}>
          { Species.list.map((speciesDef) => {
            return (
              <li style={listItemStyle}>
                <Link
                  to={`/${speciesDef.nickname}/upload`}
                  className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                  style={textStyle}>
                  {speciesDef.formattedName}
                </Link>
              </li>
            );
          }) }
        </ul>
      </section>
    );
  },

});
