import PropTypes from 'prop-types';

export const Column = PropTypes.shape({
  index: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

export const HistoryEntry = PropTypes.shape({
  index: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
});

export const GeometricPoint = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
});

export const MapPosition = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.number.isRequired),
  PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
]);
