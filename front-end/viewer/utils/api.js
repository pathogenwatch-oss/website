/* eslint-disable no-throw-literal */

import axios from "axios";

import config from "./config";

const apiClient = axios.create({
  baseURL: config.apiUrl,
});

function apiRequest(request) {
  return (
    apiClient.request(request)
      .then((res) => res.data)
      .catch((error) => {
        console.error(error);
        throw {
          error,
          code: error?.response?.status,
          status: error?.response?.statusText,
          message: error?.response?.data,
        };
      })
  );
}

export function getProjectJson(projectId, stateId) {
  return apiRequest({
    method: "get",
    url: "/projects/json",
    params: { project: projectId, state: stateId },
  });
}

export function storeFile(fileInput) {
  return apiRequest({
    method: "post",
    url: "/files/store",
    data: fileInput,
    headers: {
      "content-type": fileInput.type || "application/octet-stream",
    },
  });
}

export function saveProject(projectJson, projectId) {
  return apiRequest({
    method: "post",
    url: "/projects/create",
    data: projectJson,
    params: { linkedProjectId: projectId },
  });
}

export function updateProject(projectJson, projectId) {
  return apiRequest({
    method: "post",
    url: "/projects/update",
    data: projectJson,
    params: { project: projectId },
  });
}

export function sendFeedback(feedbackText, emailAddress, screenshotImage) {
  return apiRequest({
    method: "post",
    url: "/feedback/send",
    data: {
      feedbackText,
      emailAddress,
      screenshotImage,
    },
  });
}

/* OLD API */

function apiUrl(path) {
  return `${config.apiUrl}${path}`;
}

function apiError(err) {
  console.error(err);
  let list = null;
  if (err.responseJSON) {
    list = err.responseJSON;
  } else if (err.status === 400) {
    list = [ err.responseText ];
  }
  return {
    code: err.status,
    message: list,
  };
}

function sendGetRequest(path, data) {
  return new Promise((resolve, reject) => {
    window.jQuery.get(
      path,
      data
    )
      .done(resolve)
      .fail(error => reject(apiError(error)));
  });
}

function sendPostRequest(path, data) {
  return new Promise((resolve, reject) => {
    window.jQuery.ajax({
      type: "POST",
      data: JSON.stringify(data, null, 2),
      dataType: "json",
      url: path,
      contentType: "application/json; charset=UTF-8",
    })
      .done(resolve)
      .fail(error => reject(apiError(error)));
  });
}

function createProject(projectData) {
  return sendPostRequest(
    apiUrl("/project/create"),
    projectData
  )
    .then((projectMetadata) =>
      Object.assign({}, projectData, projectMetadata)
    );
}

function getUserProjects() {
  return sendGetRequest(
    apiUrl("/project/list")
  );
}

function getUserProject(project) {
  return sendGetRequest(
    apiUrl("/project/details"),
    { project }
  );
}

function updateUserProject(project, projectData) {
  return sendPostRequest(
    apiUrl(`/project/update?project=${project}`),
    projectData
  );
}

function deleteUserProject(project) {
  return sendPostRequest(apiUrl("/project/delete"), { project });
}


function saveProjectState(projectId, viewId, isUpdate, stateData) {
  return sendPostRequest(
    apiUrl(`/project/save-state?project=${projectId}&view=${viewId || ""}&update=${isUpdate || false}`),
    stateData
  );
}

function setDefaultView(project, viewId) {
  return sendPostRequest(
    apiUrl(`/project/set-default-view?shortId=${project}`),
    { viewId }
  );
}

function checkProjectShortId(shortId) {
  return sendPostRequest(
    apiUrl("/project/short-id"),
    { shortId }
  );
}

function getListedProjects() {
  return sendGetRequest(
    apiUrl("/showcase/listed")
  );
}

function getPasswordlessToken(email) {
  return sendPostRequest(
    "/auth/passwordless",
    { user: email }
  );
}

function checkDataSource(url) {
  return sendPostRequest(
    apiUrl("/data/check"),
    { url }
  );
}

function sendInvitation(project, email) {
  return sendPostRequest(
    apiUrl("/project/send-invitation"),
    { project, email }
  );
}

function revokeInvitation(project, email) {
  return sendPostRequest(
    apiUrl("/project/revoke-invitation"),
    {
      project,
      email,
    }
  );
}

function revokeUser(project, email) {
  return sendPostRequest(
    apiUrl("/project/revoke-user-access"),
    {
      project,
      email,
    }
  );
}

function createApiAcessToken() {
  return sendPostRequest(
    apiUrl("/account/create-api-access-token")
  );
}

function revokeApiAcessToken() {
  return sendPostRequest(
    apiUrl("/account/revoke-api-access-token")
  );
}

function getApiAcessToken() {
  return sendPostRequest(
    apiUrl("/account/get-api-access-token")
  );
}

export default {
  createApiAcessToken,
  revokeApiAcessToken,
  getApiAcessToken,
  checkDataSource,
  checkProjectShortId,
  createProject,
  deleteUserProject,
  getListedProjects,
  getPasswordlessToken,
  getUserProject,
  getUserProjects,
  revokeInvitation,
  revokeUser,
  saveProjectState,
  setDefaultView,
  sendInvitation,
  updateUserProject,
};
