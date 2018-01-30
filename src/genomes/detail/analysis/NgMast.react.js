import React from 'react';

export default ({ ngmast, por, tbpb }) => (
  <div>
    <h2>NG-MAST</h2>
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
  </div>
);
