import React from 'react';

const name = 'Staphylococcus aureus';
const formattedName = (<em>{name}</em>);
const shortName = 'S. aureus';
const formattedShortName = (<em>{shortName}</em>);

export default {
  id: '1280',
  nickname: 'saureus',
  name,
  formattedName,
  shortName,
  formattedShortName,
  definitionText: (
    <span>
      <strong>{formattedName}</strong>, a Gram-positive coccal bacterium.
    </span>
  ),
  maxAssemblySize: 3.5 * Math.pow(10, 6),
  gcRange: {
    min: 31,
    max: 35,
  },
  publicMetadataColumnNames: [
    'ena study',
    'ena run',
    'alternative isolate id',
    'country',
    'city',
    'geo accuracy',
    'host',
    'mlst',
    'mrsa',
  ],
  desc: (
    <span>
      <p>{formattedName} is a Gram-positive microorganism. While the nasal colonization by {formattedShortName} is fairly widespread and occurs asymptomatically, {formattedShortName} can also transform into a pathogen causing a diverse infections ranging from mild skin infections to life-threatening conditions. {formattedShortName} in its methicillin-sensitive (MSSA) form but especially in its methicillin-resistant (MRSA) or even multi-resistant form are threatening the community and healthcare system worldwide and it has reached the status of being one of the most common causative agents for infectious disease.</p>
      {/*<p>Upload your genome assemblies and interact with results:</p>
      <ul>
        <li><i className="material-icons">local_pharmacy</i> AMR - Prediction of antimicrobial resistance.</li>
        <li><i className="material-icons">nature_people</i> Trees - Cluster genomes using nucleotide similarity at shared regions.</li>
        <li><i className="material-icons">language</i> Compare - Position your genomes(s) in the population.</li>
        <li><i className="material-icons">file_download</i> Download all results and/or share data.</li>
      </ul>*/}
    </span>
  ),
  collections: [
    { id: 'pvhcy9uopt05',
      name: 'SA_001_004',
      author: (<span>Castillo-Ramirez <em>et al.</em> (2012)</span>),
      size: 145,
      title: (
        <span>Phylogeographic variation in recombination rates within a global clone of methicillin-resistant <em>Staphylococcus aureus</em> </span>
      ),
      pmid: '23270620',
    },

    { id: 'u0ka3roo1kh5',
      name: 'SA_003',
      author: (<span>Ellington <em>et al.</em> (2015)</span>),
      size: 23,
      title: (
        <span>Emergent and evolving antimicrobial resistance cassettes in community-associated fusidic acid and meticillin-resistant <em>Staphylococcus aureus</em></span>
      ),
      pmid: '25769787',
    },

    { id: 'gf8ftkvvskd7',
      name: 'SA_004',
      author: (<span>Harris <em>et al.</em> (2010)</span>),
      size: 58,
      title: (
        <span>Evolution of MRSA During Hospital Transmission and Intercontinental Spread</span>
      ),
      pmid: '20093474',
    },

    { id: 't2nbcpwm6ont',
      name: 'SA_015',
      author: (<span>Harris <em>et al.</em> (2013)</span>),
      size: 65,
      title: (
        <span>Whole-genome sequencing for analysis of an outbreak of meticillin-resistant <em>Staphylococcus aureus</em>: a descriptive study</span>
      ),
      pmid: '23158674',
    },

    { id: 'mq2u89rctp3u',
      name: 'SA_006',
      author: (<span>Holden <em>et al.</em> (2013)</span>),
      size: 192,
      title: (
        <span>A genomic portrait of the emergence, evolution, and global spread of a methicillin-resistant <em>Staphylococcus aureus</em> pandemic</span>
      ),
      pmid: '23299977',
    },

    { id: '25qlfgvm13ql',
      name: 'SA_007',
      author: (<span>Hsu <em>et al.</em> (2015)</span>),
      size: 259,
      title: (
        <span>Evolutionary dynamics of methicillin-resistant <em>Staphylococcus aureus</em> within a healthcare system</span>
      ),
      pmid: '25903077',
    },

    { id: 'pqmpmgp682sz',
      name: 'SA_009',
      author: (<span>Köser <em>et al.</em> (2012)</span>),
      size: 13,
      title: (
        <span>Rapid Whole-Genome Sequencing for Investigation of a Neonatal MRSA Outbreak</span>
      ),
      pmid: '22693998',
    },

    { id: 'mw65kstrghfh',
      name: 'SA_011',
      author: (<span>Dordel <em>et al.</em> (2014)</span>),
      size: 54,
      title: (
        <span>Novel Determinants of Antibiotic Resistance: Identification of Mutated Loci in Highly Methicillin-Resistant Subpopulations of Methicillin-Resistant <em>Staphylococcus aureus</em></span>
      ),
      pmid: '24713324',
    },

    { id: '8shl40iywh2q',
      name: 'SA_017',
      author: (<span>Harrison <em>et al.</em> (2014)</span>),
      size: 68,
      title: (
        <span>A Shared Population of Epidemic Methicillin-Resistant <em>Staphylococcus aureus</em> 15 Circulates in Humans and Companion Animals</span>
      ),
      pmid: '24825010',
    },

    { id: '4lkoblcgeq7l',
      name: 'SA_018',
      author: (<span>Harrison <em>et al.</em> (2013)</span>),
      size: 7,
      title: (
        <span>Whole genome sequencing identifies zoonotic transmission of MRSA isolates with the novel mecA homologue mecC</span>
      ),
      pmid: '23526809',
    },
  ],
};
