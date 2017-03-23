import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import ListItem from './ListItem.react';
import Header from './Header.react';

import { getGridItems } from '../selectors';

export const ListView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  render() {
    const { items } = this.props;

    return (
      <Grid
        className="wgsa-genome-list-view"
        template={ListItem}
        items={items}
        columnCount={1}
        rowHeight={40}
        rightMargin={48}
        header={<Header />}
      />
    );
  },

});

function mapStateToProps(state) {
  return {
    items: getGridItems(state),
  };
}

export default connect(mapStateToProps)(ListView);
