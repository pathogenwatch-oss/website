import React from 'react';

import NotFound from '../components/NotFound.react';

import { DefaultContent } from '../header/DefaultContent.react';

import CONFIG from '../app/config';

function getWikiPageMarkdown(page = 'Home') {
  return new Promise((resolve, reject) => {
    $.get(`${CONFIG.wiki}/${page}.md`)
      .done(markdown => resolve(markdown))
      .fail(error => reject(error));
  });
}

export default {
  path: 'documentation(/:page)',
  getComponent({ params }, callback) {
    getWikiPageMarkdown(params.page)
      .then(markdown =>
        require.ensure([], require => {
          const Markdown = require('./Markdown.react').default;
          callback(null, () => <Markdown page={params.page} markdown={markdown} />);
        })
      )
      .catch(() => callback(null, () => <NotFound />));
  },
  header: <DefaultContent asideDisabled />,
  onEnter() {
    document.title = 'WGSA | Documentation';
  },
};
