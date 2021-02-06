/* eslint-disable class-methods-use-this */

import React from "react";
import NProgress from "nprogress";
import PropTypes from "prop-types";

import "../css/loading.css";

class Loading extends React.Component {

  componentDidMount() {
    NProgress.start();
  }

  componentWillUnmount() {
    NProgress.done();
  }

  render() {
    return (
      <div className="mr-loading mdl-typography--text-center">
        <div>
          <img src="/images/logos/icon-spinner.gif" />
          <p className="mr-heading mdl-typography--display-1">
            {this.props.children}
          </p>
        </div>
      </div>
    );
  }
}

Loading.displayName = "Loading";

Loading.propTypes = {
  children: PropTypes.node,
};

export default Loading;
