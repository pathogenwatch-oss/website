import React from 'react';

export default ({ result }) => (
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
          <td>{result.ngmast}</td>
          <td>{result.por}</td>
          <td>{result.tbpb}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
