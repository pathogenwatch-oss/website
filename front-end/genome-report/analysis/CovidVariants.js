import React from 'react';

import ExternalLink from '../ExternalLink.react';

function generateDocLink(variant) {
  return (
    <div>
      <p>{variant}
        <ExternalLink
          to={`/genomes/all?genusId=694002&sars_cov2_variants=${variant}&subspecies=SARS-CoV-2`}
        >
          {'PW Search'}
        </ExternalLink>
        <ExternalLink to={`https://cgps.gitlab.io/cog-uk/type_variants/#${variant}`}>
          {'Source'}
        </ExternalLink>
      </p>
    </div>
  );
}

function generateColumn(variants, type) {
  return (
    <div className="pw-genome-report-metadata">
      <dt>{type}</dt>
      <dd>{
        variants
          .filter(variant => variant.state !== 'ref')
          .filter(variant => variant.type === type)
          .map(variant => generateDocLink(variant.name))
      }</dd>
    </div>
  );
}

export default ({ genome }) => {
  // eslint-disable-next-line camelcase
  const { sars_cov2_variants } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Sentinel Variants</h2>
        <a
          href="https://cgps.gitlab.io/cog-uk/type_variants/"
          target="_blank"
          rel="noopener"
          title="View complete list of variants at GitLab."
        >
            https://cgps.gitlab.io/cog-uk/type_variants/
        </a>
      </header>
      {sars_cov2_variants.alt_count === 0 && <p>No sentinel variants found.</p>}
      {sars_cov2_variants.alt_count > 0 &&
      <dl className="grid">
        {
          [ 'Amino Acid', 'Deletion', 'SNP' ]
            .map(type => generateColumn(sars_cov2_variants.variants, type))
        }
      </dl>
      }
    </React.Fragment>
  );
};

// {
//     "ref_count" : 46,
//     "alt_count" : 2,
//     "other_count" : 0,
//     "fraction_alt" : 0.0417,
//     "variants" : {
//         "S235F" : {
//             "type" : "Amino Acid",
//             "ref" : "S",
//             "var" : "F",
//             "found" : "S"
//         },
//         "T1001I" : {
//             "type" : "Amino Acid",
//             "ref" : "T",
//             "var" : "I",
//             "found" : "T"
//         },
//         "P314L" : {
//             "type" : "Amino Acid",
//             "ref" : "P",
//             "var" : "L",
//             "found" : "L"
//         },
//         "Q27*" : {
//             "type" : "Amino Acid",
//             "ref" : "Q",
//             "var" : "*",
//             "found" : "Q"
//         },
//         "A222V" : {
//             "type" : "Amino Acid",
//             "ref" : "A",
//             "var" : "V",
//             "found" : "A"
//         },
//         "A475V" : {
//             "type" : "Amino Acid",
//             "ref" : "A",
//             "var" : "V",
//             "found" : "A"
//         },
//         "A626S" : {
//             "type" : "Amino Acid",
//             "ref" : "A",
//             "var" : "S",
//             "found" : "A"
//         },
//         "A831V" : {
//             "type" : "Amino Acid",
//             "ref" : "A",
//             "var" : "V",
//             "found" : "A"
//         },
//         "D614G" : {
//             "type" : "Amino Acid",
//             "ref" : "D",
//             "var" : "G",
//             "found" : "G"
//         },
//         "D80Y" : {
//             "type" : "Amino Acid",
//             "ref" : "D",
//             "var" : "Y",
//             "found" : "D"
//         },
//         "E484A" : {
//             "type" : "Amino Acid",
//             "ref" : "E",
//             "var" : "A",
//             "found" : "E"
//         },
//         "E484K" : {
//             "type" : "Amino Acid",
//             "ref" : "E",
//             "var" : "K",
//             "found" : "E"
//         },
//         "E484Q" : {
//             "type" : "Amino Acid",
//             "ref" : "E",
//             "var" : "Q",
//             "found" : "E"
//         },
//         "E484R" : {
//             "type" : "Amino Acid",
//             "ref" : "E",
//             "var" : "R",
//             "found" : "E"
//         },
//         "F490S" : {
//             "type" : "Amino Acid",
//             "ref" : "F",
//             "var" : "S",
//             "found" : "F"
//         },
//         "G446A" : {
//             "type" : "Amino Acid",
//             "ref" : "G",
//             "var" : "A",
//             "found" : "G"
//         },
//         "G446S" : {
//             "type" : "Amino Acid",
//             "ref" : "G",
//             "var" : "S",
//             "found" : "G"
//         },
//         "G446V" : {
//             "type" : "Amino Acid",
//             "ref" : "G",
//             "var" : "V",
//             "found" : "G"
//         },
//         "K150R" : {
//             "type" : "Amino Acid",
//             "ref" : "K",
//             "var" : "R",
//             "found" : "K"
//         },
//         "K150T" : {
//             "type" : "Amino Acid",
//             "ref" : "K",
//             "var" : "T",
//             "found" : "K"
//         },
//         "K378N" : {
//             "type" : "Amino Acid",
//             "ref" : "K",
//             "var" : "N",
//             "found" : "K"
//         },
//         "K444N" : {
//             "type" : "Amino Acid",
//             "ref" : "K",
//             "var" : "N",
//             "found" : "K"
//         },
//         "K444R" : {
//             "type" : "Amino Acid",
//             "ref" : "K",
//             "var" : "R",
//             "found" : "K"
//         },
//         "L452R" : {
//             "type" : "Amino Acid",
//             "ref" : "L",
//             "var" : "R",
//             "found" : "L"
//         },
//         "L455F" : {
//             "type" : "Amino Acid",
//             "ref" : "L",
//             "var" : "F",
//             "found" : "L"
//         },
//         "N439K" : {
//             "type" : "Amino Acid",
//             "ref" : "N",
//             "var" : "K",
//             "found" : "N"
//         },
//         "N440K" : {
//             "type" : "Amino Acid",
//             "ref" : "N",
//             "var" : "K",
//             "found" : "N"
//         },
//         "N450D" : {
//             "type" : "Amino Acid",
//             "ref" : "N",
//             "var" : "D",
//             "found" : "N"
//         },
//         "N501Y" : {
//             "type" : "Amino Acid",
//             "ref" : "N",
//             "var" : "Y",
//             "found" : "N"
//         },
//         "N501*" : {
//             "type" : "Amino Acid",
//             "ref" : "N",
//             "var" : "*",
//             "found" : "N"
//         },
//         "P681H" : {
//             "type" : "Amino Acid",
//             "ref" : "P",
//             "var" : "H",
//             "found" : "P"
//         },
//         "Q493R" : {
//             "type" : "Amino Acid",
//             "ref" : "Q",
//             "var" : "R",
//             "found" : "Q"
//         },
//         "R346K" : {
//             "type" : "Amino Acid",
//             "ref" : "R",
//             "var" : "K",
//             "found" : "R"
//         },
//         "R346S" : {
//             "type" : "Amino Acid",
//             "ref" : "R",
//             "var" : "S",
//             "found" : "R"
//         },
//         "S477N" : {
//             "type" : "Amino Acid",
//             "ref" : "S",
//             "var" : "N",
//             "found" : "S"
//         },
//         "S98F" : {
//             "type" : "Amino Acid",
//             "ref" : "S",
//             "var" : "F",
//             "found" : "S"
//         },
//         "V1122L" : {
//             "type" : "Amino Acid",
//             "ref" : "V",
//             "var" : "L",
//             "found" : "V"
//         },
//         "V445A" : {
//             "type" : "Amino Acid",
//             "ref" : "V",
//             "var" : "A",
//             "found" : "V"
//         },
//         "V483A" : {
//             "type" : "Amino Acid",
//             "ref" : "V",
//             "var" : "A",
//             "found" : "V"
//         },
//         "Y449H" : {
//             "type" : "Amino Acid",
//             "ref" : "Y",
//             "var" : "H",
//             "found" : "Y"
//         },
//         "Y453F" : {
//             "type" : "Amino Acid",
//             "ref" : "Y",
//             "var" : "F",
//             "found" : "Y"
//         },
//         "Y508H" : {
//             "type" : "Amino Acid",
//             "ref" : "Y",
//             "var" : "H",
//             "found" : "Y"
//         },
//         "del:11288:9" : {
//             "type" : "Deletion",
//             "ref" : "TCTGGTTTT",
//             "var" : "---------",
//             "found" : "TCTGGTTTT"
//         },
//         "del:21765:6" : {
//             "type" : "Deletion",
//             "ref" : "TACATG",
//             "var" : "------",
//             "found" : "TACATG"
//         },
//         "del:21767:3" : {
//             "type" : "Deletion",
//             "ref" : "CAT",
//             "var" : "---",
//             "found" : "CAT"
//         },
//         "snp:A28111G" : {
//             "type" : "SNP",
//             "ref" : "A",
//             "var" : "G",
//             "found" : "A"
//         },
//         "snp:C3267T" : {
//             "type" : "SNP",
//             "ref" : "C",
//             "var" : "T",
//             "found" : "C"
//         },
//         "snp:G24914C" : {
//             "type" : "SNP",
//             "ref" : "G",
//             "var" : "C",
//             "found" : "G"
//         }
//     }
// }

const foo = {
  variants:
    [ {
      name: 'A831V',
      type: 'Amino Acid',
      found: 'V',
      present: true,
    },
    {
      name: 'Y453F',
      type: 'Amino Acid',
      found: 'Y',
      present: false,
    } ],
};

//   }
// ]
