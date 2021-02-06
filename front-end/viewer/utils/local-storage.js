/* global localforage */

const dataPrefix = "microreact.project.data";
const namePrefix = "microreact.project.names";

export function saveProject(data) {
  localforage.setItem(
    `${dataPrefix}.${data.id}`,
    JSON.stringify(data),
  );
  // if (data.name) {
  //   window.localStorage.setItem(
  //     `${namePrefix}.${data.id}`,
  //     data.name,
  //   );
  // }
}

export function loadProject(id) {
  return JSON.parse(
    window.localStorage.getItem(`${dataPrefix}.${id}`)
  );
}

export function getAllProjects() {
  const items = [];
  const keys = Object.keys(window.localStorage);

  for (const key of keys) {
    if (key.startsWith(dataPrefix)) {
      const id = key.substr(dataPrefix.length + 1);
      items.push({
        id,
        name: window.localStorage.getItem(`${namePrefix}.${id}`),
      });
    }
  }

  return items;
}
