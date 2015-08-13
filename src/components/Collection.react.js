import React from 'react';

import Loading from './Loading.react';
import ProjectViewer from './ProjectViewer.react';
import NotFound from './NotFound.react';
import ProjectActionCreators from '../actions/ProjectActionCreators';
import ProjectStore from '../stores/ProjectStore';

export default class Collection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      project: null,
    };
  }

  handleProjectStoreChange() {
    this.setState({
      project: 'LOADED',
    });
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.handleProjectStoreChange.bind(this));
    ProjectActionCreators.getProject(this.props.params.id);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.handleProjectStoreChange.bind(this));
  }

  render() {
    if (this.state.error) {
      return (
        <NotFound>
          Project not found.
        </NotFound>
      );
    } else if (this.state.project) {
      return (
        <ProjectViewer query={this.props.query} />
      );
    } else {
      return (
        <Loading>
          Loading project...
        </Loading>
      );
    }
  }

}
