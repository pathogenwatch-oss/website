import React from 'react';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Link } from 'react-router-dom';

import { FormattedName } from '../organisms';

const icons = {
  genome: 'cloud_upload',
  collection: 'collections',
};

const content = {
  genome: ({ count, date }) =>
    <Link to={`/genomes/user?uploadedAt=${date}`}>
      Uploaded <strong>{count}</strong> genome{count === 1 ? '' : 's'}
    </Link>,
  collection: ({ size, organismId, title, slug }) => (
    <Link to={`/collection/${slug}`}>
      Created collection <strong>{title}</strong> (<FormattedName fullName organismId={organismId} />, <strong>{size}</strong> genomes)
    </Link>
  ),
};

export default (item) => (
  <li className="wgsa-activity-item">
    <i className="material-icons">{icons[item.type]}</i>
    {content[item.type](item)}
    <span className="wgsa-activity-item__time" title={item.formattedDate}>
      {distanceInWordsToNow(item.date)} ago
    </span>
  </li>
);
