/* eslint-disable class-methods-use-this */

import Button from "@material-ui/core/Button";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import ComputerTwoToneIcon from "@material-ui/icons/ComputerTwoTone";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import InsertDriveFileTwoToneIcon from "@material-ui/icons/InsertDriveFileTwoTone";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import WebAssetTwoToneIcon from "@material-ui/icons/WebAssetTwoTone";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

import { save } from "microreact-viewer/src/actions/ui";
import { downloadDataUrl } from "microreact-viewer/src/utils/downloads";
import { getContainerElement } from "microreact-viewer/src/utils/html";
import { presentStateSelector } from "microreact-viewer/src/selectors";
import IconStack from "microreact-viewer/src/components/IconStack.react";
import MicroreactIcon from "microreact-viewer/src/components/MicroreactIcon.react";

import "../css/viewer.css";
import store from "../store";
import config, { update as updateConfig } from "../utils/config";
import * as LocalStorage from "../utils/local-storage";
import * as Api from "../utils/api";
import * as Projects from "../utils/projects";

import UiCopyTextfield from "./UiCopyTextfield.react";

const initialState = {
  isSaveDialogOpen: false,
  savingMode: false,
  savingError: null,
};

class ProjectSaveDialog extends React.PureComponent {

  state = {
    ...initialState,
  }

  componentWillUnmount() {
    window.onLoginSuccess = undefined;
  }

  openDialog = () => {
    const presentState = presentStateSelector(store.getState());
    this.setState({
      isSaveDialogOpen: true,
      name: presentState.meta.name || "Unnamed Project",
      description: presentState.meta.description || "",
      jsonDataPromise: store.dispatch(save()),
    });
  }

  closeDialog = () => {
    this.setState(initialState);
  }

  createProjectDocument = async () => {
    const project = await this.state.jsonDataPromise;
    project.meta.name = this.state.name;
    project.meta.description = this.state.description;
    return project;
  }

  handleDownloadFile = () => {
    this.createProjectDocument()
      .then((data) => {
        downloadDataUrl(
          JSON.stringify(
            data,
            null,
            2,
          ),
          `${data.meta.name ?? "Unnamed Project"}.microreact`,
          "application/json",
        );
      });
  }

  handleLocalStorage = () => {
    this.setState({ savingMode: "local" });

    Promise.resolve()
      .then(this.createProjectDocument)
      .then(LocalStorage.saveProject)
      .then((project) => {
        // window.history.pushState(null, projectJson.meta.name, project.url);
        this.setState({
          // projectUrl: project.url,
          savingMode: "done",
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          savingMode: "error",
          savingError: error,
        });
      });
  }

  handleSaveOnServer = () => {
    this.setState({ savingMode: "server" });

    this.createProjectDocument()
      .then((projectJson) => {
        return Projects.saveProjectOnServer(projectJson, this.props.projectProps.projectId)
          .then((project) => {
            this.setState({
              projectUrl: project.url,
              savingMode: "done",
            });
          });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          savingMode: "error",
          savingError: error,
        });
      });
  }

  handleUpdateOnServer = () => {
    this.setState({ savingMode: "server" });

    this.createProjectDocument()
      .then((projectJson) => {
        return Api.updateProject(projectJson, this.props.projectProps.projectId)
          .then((project) => {
            this.setState({
              projectUrl: project.url,
              savingMode: "done",
            });
          });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          savingMode: "error",
          savingError: error,
        });
      });
  }

  handleLogin = () => {
    const windowObjectReference = window.open(
      "/signin",
      "DescriptiveWindowName",
      "resizable,scrollbars,status"
    );
    window.onLoginSuccess = () => {
      updateConfig(windowObjectReference.Microreact);
      this.setState({ loggedIn: new Date() });
    };
  }

  render() {
    const { props } = this;

    if (!this.state.isSaveDialogOpen) {
      return null;
    }

    return (
      <Dialog
        className="mr-save-project"
        container={getContainerElement}
        disableBackdropClick
        fullWidth
        maxWidth="sm"
        onClose={this.closeDialog}
        open={this.state.isSaveDialogOpen}
      >
        { (this.state.savingMode === "local" || this.state.savingMode === "local" || this.state.savingMode === "server") && (<LinearProgress />) }

        {
          (this.state.savingMode === "done") && (
            <div>
              <CheckCircleTwoToneIcon
                className="mr-saved-done"
              />
            </div>
          )
        }

        <DialogTitle>
          {
            (this.state.savingMode === "server") ? "Saving project on Microreact.org..." :
              (this.state.savingMode === "local") ? "Saving project to Local Storage..." :
                (this.state.savingMode === "done") ? "Project Saved!" :
                  "Save Project"
          }
          <IconButton
            className="mr-close-button"
            onClick={(this.closeDialog)}
            size="small"
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {
            (this.state.savingMode) && (
              <div className="mr-blinder">
                { (this.state.savingMode === "error") && (<pre>{ this.state.savingError?.message }</pre>) }
                {
                  (this.state.savingMode === "done" || this.state.projectUrl) && (
                    <UiCopyTextfield
                      value={this.state.projectUrl}
                    />
                  )
                }
              </div>
            )
          }

          <section className="mr-project-info">
            <TextField
              label="Project name"
              variant="outlined"
              size="small"
              placeholder="The name of your project"
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
            />
            <TextField
              label="Description (optional)"
              multiline
              rows={1}
              // defaultValue="Default Value"
              placeholder="Describe your project (briefly)"
              variant="outlined"
              value={this.state.description}
              onChange={(event) => this.setState({ description: event.target.value })}
            />
          </section>

          <section className="mr-save-actions">

            <Button
              variant="outlined"
              size="large"
              color="primary"
              className="mr-download-file"
              onClick={(this.handleDownloadFile)}
            >
              <IconStack style={{ padding: "8px 0" }}>
                <InsertDriveFileTwoToneIcon />
                <GetAppRoundedIcon style={{ marginTop: "6px" }} />
              </IconStack>
              <p>
                Download as
                <br/>
                <strong><code>.microreact</code> file</strong>
              </p>
            </Button>

            <Button
              variant="outlined"
              size="large"
              color="primary"
              className="mr-local-storage"
              onClick={this.handleLocalStorage}
              title="Data will be stored client-side inside this browser."
            >
              <IconStack>
                <ComputerTwoToneIcon />
                <LockRoundedIcon style={{ marginTop: "-4px" }} />
              </IconStack>
              <p>
                Save in
                <br/>
                <strong>Local Storage</strong>
              </p>
            </Button>

            {
              (config.user && props.projectProps.isOwner) && (
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  className="mr-microreact-org"
                  onClick={this.handleUpdateOnServer}
                >
                  <IconStack>
                    <WebAssetTwoToneIcon />
                    <EditRoundedIcon style={{ marginTop: "3px" }} />
                  </IconStack>
                  <p>
                    Update
                    <br/>
                    <strong>Existing Project</strong>
                  </p>
                </Button>
              )
            }

            {
              config.user ?
                (
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    className="mr-microreact-org"
                    onClick={this.handleSaveOnServer}
                  >
                    <IconStack>
                      <WebAssetTwoToneIcon />
                      <MicroreactIcon style={{ marginTop: "3px" }} />
                    </IconStack>
                    <p>
                      Save as
                      <br/>
                      <strong>a New Project</strong>
                    </p>
                  </Button>
                )
                :
                (
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    className="mr-microreact-org"
                    // href="/signin"
                    // target="_blank"
                    onClick={this.handleLogin}
                  >
                    <IconStack>
                      <WebAssetTwoToneIcon />
                      <MicroreactIcon style={{ marginTop: "3px" }} />
                    </IconStack>
                    <p>
                      Sign in to save on
                      <br/>
                      <strong>Microreact.org</strong>
                    </p>
                  </Button>
                )
            }

          </section>
        </DialogContent>
      </Dialog>
    );
  }

}

ProjectSaveDialog.propTypes = {
  projectProps: PropTypes.object,
};

ProjectSaveDialog.defaultProps = {
  projectProps: {},
};

ProjectSaveDialog.displayName = "ProjectSaveDialog";

export default ProjectSaveDialog;
