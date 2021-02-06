// import 'microreact-viewer/dist/microreact-viewer.css';

import React from "react";
import { load, unload, query } from "microreact-viewer/src/actions/ui";

import PropTypes from "prop-types";

import Loading from "./Loading.react";
import ProjectViewer from "./ProjectViewer.react";

import { getProjectJson } from "../utils/api";
import config from "../utils/config";

import store from "../store";

class ProjectPage extends React.Component {
  static displayName = "Project";

  static propTypes = {
    params: PropTypes.object,
    location: PropTypes.object,
  };

  state = {
    error: null,
    projectProps: null,
  };

  componentDidMount() {
    this.originalTitle = document.title;
    const projectSlug = this.props.params.projectSlug;
    getProjectJson(
      projectSlug,
      this.props.params.stateId
    )
      .then((projectJson) => {
        document.title = `Pathogenwatch - ${projectJson.meta.name || "Untitled Project"}`;
        projectJson.query = (this.props?.location?.query) || {};
        projectJson.config = { mapboxApiAccessToken: config.options.mapboxApiAccessToken };
        return (
          store.dispatch(load(projectJson))
            .then(() => projectJson._)
        );
      })
      .then((projectProps) => {
        this.setState({ projectSlug, projectProps });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps?.location?.search !== this.props?.location?.search && this.props?.location?.search) {
      store.dispatch(query(this.props?.location?.query));
    }
  }

  componentWillUnmount() {
    store.dispatch(unload());
    console.log("store unload");
    document.title = this.originalTitle;
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          {...this.state.error}
        </div>
      );
    }

    if (this.state.projectSlug) {
      return (
        <ProjectViewer
          key={this.state.projectSlug}
          projectProps={this.state.projectProps}
        />
      );
    }

    return (
      <Loading>
        Loading Project
      </Loading>
    );
  }
}

export default ProjectPage;
