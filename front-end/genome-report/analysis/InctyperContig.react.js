import React from 'react';

export default ({ matches, amrMatches = [], library, setBackground = false, displayAmr = false }) => {
  const isBasicLayout = library === 'gram_negative';
  const typeField = isBasicLayout ? 'Inc Match' : 'Group';
  const typeList = matches.reduce((types, match) => {
    types.push(match[typeField].replace(/_\d+$/, ''));
    return types;
  }, []);

  typeList.sort();
  matches.sort((a, b) => a['Contig Start'] - b['Contig Start']);

  return (
    <React.Fragment>
      <tbody className={'pw-inctyper-contig'}>
        {
          matches.map((match, index) =>
            (index === 0 ? (
              <tr>
                <td rowSpan={matches.length}>{typeList.join('/')}</td>
                {displayAmr &&
                <td rowSpan={matches.length}>{amrMatches.length === 0 ? '-' : amrMatches.join(', ')}</td>}
                <td>{match['Inc Match']}</td>
                <td>{match['Percent Identity']}</td>
                <td>{match['Match Coverage']}</td>
              </tr>
            ) : (
              <tr>
                <td>{match['Inc Match']}</td>
                <td>{match['Percent Identity']}</td>
                <td>{match['Match Coverage']}</td>
              </tr>
            ))
          )
        }
      </tbody>
    </React.Fragment>
  );
};
