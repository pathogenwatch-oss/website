import React from 'react';
import { connect } from 'react-redux';

import Spinner from '../components/Spinner.react';
import ActivityItem from './ActivityItem.react';

import { getActivity } from './selectors';

import { fetchActivity } from './actions';

import { statuses } from './constants';

const ActivityList = React.createClass({

  componentDidMount() {
    this.props.fetch();
  },

  render() {
    const { activity } = this.props;

    if (activity === statuses.LOADING) {
      return <Spinner />;
    }

    if (activity === statuses.ERROR) {
      return <p>Failed to fetch recent activity 😔</p>;
    }

    if (activity && Array.isArray(activity)) {
      return (
        <ul className="wgsa-activity-list">
          {activity.map(item => <ActivityItem key={item.date} {...item} />)};
        </ul>
      );
    }

    return null;
  },

});

function mapStateToProps(state) {
  return {
    activity: getActivity(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchActivity()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);
