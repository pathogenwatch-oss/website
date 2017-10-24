import React from 'react';
import { Route } from 'react-router-dom';

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

const DocumentationViewerRoute = createClass({

  getInitialState() {
    return {
      page: 'Home',
      markdown: null,
      error: false,
    };
  },

  componentWillMount() {
    document.title = 'WGSA | Documentation';
    this.fetchPage(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.fetchPage(nextProps);
  },

  fetchPage({ match }) {
    const { page } = match.params;
    getWikiPageMarkdown(page)
      .then(markdown => this.setState({ page, markdown, error: false }))
      .catch(() => this.setState({ error: true }));
  },

  render() {
    const { page, markdown, error } = this.state;

    if (markdown) {
      return <Markdown page={page} markdown={markdown} />;
    }

    if (error) {
      return <NotFound />;
    }

    return null;
  },

});

export default (
  <Route path="/documentation/:page?" component={DocumentationViewerRoute} />
);
