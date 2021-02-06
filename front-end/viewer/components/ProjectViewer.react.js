import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";
import FeedbackTwoToneIcon from "@material-ui/icons/FeedbackTwoTone";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import MenuIcon from "@material-ui/icons/Menu";

// import { publish } from "microreact-viewer/src/utils/events";
import MicroreactViewer from "microreact-viewer/src";
import UiIconButton from "microreact-viewer/src/components/UiIconButton.react";

import "../css/viewer.css";
// import * as Api from "../utils/api";

// import Header from "./Header.react";
// import NavigationDrawer from "./NavigationDrawer.react";
// import Feedback from "./Feedback.react";
// import ProjectSaveDialog from "./ProjectSaveDialog.react";

const initialState = {
  isSaveDialogOpen: false,
  savingMode: false,
  savingError: null,
};

class ProjectViewer extends React.PureComponent {

  state = {
    ...initialState,
    // projectId: this.props.projectId,
  }

  saveDialogRef = React.createRef()

  feedbackRef = React.createRef()

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    window.onLoginSuccess = undefined;
  }

  handleFeedback = () => {
    this.feedbackRef?.current?.open();
  }

  handleSave = () => {
    this.saveDialogRef.current.openDialog();
  }

  viewerComponents = {
    drawerButton: (
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => document.querySelector(".mdl-layout__drawer-button")?.click()}
      >
        <MenuIcon />
      </IconButton>
    ),
    prependNavButtons: (
      <UiIconButton
        colour="inherit"
        onClick={this.handleFeedback}
        title="Send feedback"
      >
        <FeedbackTwoToneIcon />
      </UiIconButton>
    ),
    appendNavButtons: (
      <UiIconButton
        colour="inherit"
        onClick={this.handleSave}
        title="Save project"
      >
        <SaveRoundedIcon />
      </UiIconButton>
    ),
  }

  render() {
    return (
      <div className="mdl-layout__container">
        <div
          className="mdl-layout mdl-js-layout mdl-layout--fixed-header mr-server"
        >
          <MicroreactViewer
            components={this.viewerComponents}
          >
            {/* <ProjectSaveDialog
              ref={this.saveDialogRef}
              projectProps={this.props.projectProps}
            /> */}
            {/* <Feedback
              ref={this.feedbackRef}
              onSend={Api.sendFeedback}
              onBeforeScreenshot={() => publish("before-screenshot")}
              onAfterScreenshot={() => publish("after-screenshot")}
            /> */}
          </MicroreactViewer>
          {/* <Header fake/> */}
          {/* <NavigationDrawer /> */}
        </div>
      </div>
    );
  }

}

ProjectViewer.propTypes = {
  projectProps: PropTypes.object,
};

ProjectViewer.defaultProps = {
  projectProps: {},
};

ProjectViewer.displayName = "ProjectViewer";

export default ProjectViewer;
