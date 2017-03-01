import React from 'react';
import { Route } from 'react-router';

import Markdown from './Markdown.react';
import NotFound from '../components/NotFound.react';

import CONFIG from '../app/config';

function getWikiPageMarkdown(page = 'Home') {
  return new Promise((resolve, reject) => {
    $.get(`${CONFIG.wiki}/${page}.md`)
      .done(markdown => resolve(markdown))
      .fail(error => reject(error));
  });
}

export default (
  <Route
    path="documentation(/:page)"
    getComponent={({ params }, callback) => {
      getWikiPageMarkdown(params.page)
        .then(markdown => callback(null, () => <Markdown page={params.page} markdown={markdown} />))
        .catch(() => callback(null, () => <NotFound />));
    }}
    onEnter={() => {
      document.title = 'WGSA | Documentation';
    }}
  />
);
