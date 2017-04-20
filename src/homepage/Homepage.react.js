import '../css/sonar.css';

import React from 'react';
import { Link } from 'react-router';

export default () => (
  <div className="wgsa-homepage">
    <section className="jumbotron">
      <img src="/images/WGSA.FINAL.svg" alt="WGSA" />
      <h1>Global AMR surveillance through Whole Genome Sequencing</h1>
    </section>
    <section className="showcase">
      <img src="/images/worldmap.svg" />
      <Link className="showcase__link showcase__link--1 wgsa-sonar-effect" />
      <Link className="showcase__link showcase__link--2 showcase__link--large wgsa-sonar-effect" />
      <Link className="showcase__link showcase__link--3 showcase__link--small wgsa-sonar-effect" />
      <Link className="showcase__link showcase__link--4 wgsa-sonar-effect" />
      <Link className="showcase__link showcase__link--5 showcase__link--large wgsa-sonar-effect" />
      <Link className="showcase__link showcase__link--6 wgsa-sonar-effect" />
      <Link className="showcase__link showcase__link--7 showcase__link--small wgsa-sonar-effect" />
    </section>
  </div>
);
