import './styles.css';

import React from 'react';

import MLST from './MLST.react';
import Specieator from './Specieator.react';
import renderGenericResults from './Generic.react';

const test = {"alleles":[["arcC",[{"id":2,"contig":"ERS010995.5119_1_5.1","start":50302,"end":50757}, {id:3}]],["aroE",[{"id":3,"contig":"ERS010995.5119_1_5.6","start":97077,"end":96622}]],["glpF",[{"id": "82e63a330c90ba6152591653dd955c2fd0d7e2e4"}]],["gmk",[{"id":1,"contig":"ERS010995.5119_1_5.15","start":34059,"end":33643}]],["pta",[{"id":4,"contig":"ERS010995.5119_1_5.26","start":22186,"end":22659}]],["tpi",[{"id":4,"contig":"ERS010995.5119_1_5.37","start":11442,"end":11843}]],["yqiL",[]]],"code":"2_3__1_4_4_3","st":"82e63a330c90ba6152591653dd955c2fd0d7e2e4","scheme":"saureus","url":"https://pubmlst.org/saureus"};

export default ({ analysis }) => {
  const { specieator, mlst = test, metrics, ...rest } = analysis;
  console.log(mlst);
  return (
    <div className="wgsa-analysis-view">
      { mlst && <MLST result={mlst} /> }
      { specieator && <Specieator result={specieator} /> }
      { renderGenericResults(rest) }
    </div>
  );
};
