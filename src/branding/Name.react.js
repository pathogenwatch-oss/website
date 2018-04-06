import { connect } from 'react-redux';

const names = {
  wgsa: 'WGSA',
  pathogenwatch: 'Pathogenwatch',
  pathogenDotWatch: 'Pathogenwatch',
};

const Name = ({ brandingId = 'Pathogenwatch' }) => names[brandingId];

function mapStateToProps(state) {
  return {
    brandingId: state.branding.id,
  };
}

export default connect(mapStateToProps)(Name);
