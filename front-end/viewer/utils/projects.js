import * as Api from "./api";

export async function saveProjectOnServer(projectJson, linkedProjectId) {
  for (const file of Object.values(projectJson.files)) {
    if (file.blob) {
      const { hash, url } = await Api.storeFile(file.blob);
      file.hash = hash;
      file.url = url;
      file.blob = undefined;
    }
  }

  const project = await Api.saveProject(
    projectJson,
    linkedProjectId
  );

  window.history.pushState(null, projectJson.meta.name, project.url);

  return project;
}
