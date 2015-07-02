var React = require('react');
var Home = require('./components/home/Home.react');
var InstructionsPage = require('./components/home/InstructionsPage.react');
var ShowcasePage = require('./components/home/ShowcasePage.react');
var AboutPage = require('./components/home/AboutPage.react');
var NotFound = require('./components/NotFound.react');
var Project = require('./components/Project.react');
var Router = require('react-router');
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Application = React.createClass({
  render: function () {
    return <RouteHandler params={this.props.params} />;
  }
});

var routes = (
  <Route name="application" path="/" handler={Application}>
    <DefaultRoute name="upload" handler={Home} />
    <Route name="instructions" path="instructions" handler={InstructionsPage} />
    <Route name="showcase" path="showcase" handler={ShowcasePage} />
    <Route name="about" path="about" handler={AboutPage} />
    <Route name="project" path="project/:projectId" handler={Project} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var params = state.params;
  React.render(<Handler params={params} />, document.body);
});
