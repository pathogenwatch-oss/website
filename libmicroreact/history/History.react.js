import React from 'react';
import PropTypes from 'prop-types';

const History = ({ entries, current, onTravel }) => (
  <ul className="libmr-History">
    {entries.map((image, index) => (
      <li
        key={index}
        tabIndex="0"
        onClick={() => onTravel(index)}
        className={index === current ? 'is-selected' : null}
      >
        <img src={image} />
      </li>
    ))}
  </ul>
);

History.propTypes = {
  current: PropTypes.number,
  entries: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTravel: PropTypes.func.isRequired,
};

export default History;
