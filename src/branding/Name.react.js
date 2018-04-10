import { connect } from 'react-redux';

import { names } from './constants';

const Name = ({ brandingId }) => names[brandingId];

function mapStateToProps(state) {
  return {
    brandingId: state.branding.id,
  };
}

export default connect(mapStateToProps)(Name);
