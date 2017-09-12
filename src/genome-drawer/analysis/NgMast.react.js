import React from 'react';

import { Section } from '../components';

export default ({ __v, ngmast, por, tbpb }) => (
  <Section heading="NG-MAST" version={__v}>
    <dl>
      <table>
        <thead>
          <tr>
            <th>NG-MAST</th>
            <th>POR</th>
            <th>TBPB</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ngmast}</td>
            <td>{por}</td>
            <td>{tbpb}</td>
          </tr>
        </tbody>
      </table>
    </dl>
  </Section>
);
