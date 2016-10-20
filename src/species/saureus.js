import React from 'react';

const name = 'Staphylococcus aureus';
const formattedName = (<em>{name}</em>);
const shortName = 'S. aureus';
const formattedShortName = (<em>{shortName}</em>);

export default {
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
  uiOptions: {
    // noPopulation: true,
    // noMLST: true,
    // noAMR: true,
  },
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
    </span>
  ),
  collections: [
    { id: '561a2bqxcsa3',
      name: 'SA_001_004',
      author: 'Castillo-Ramirez _et al._ (2012)',
      title: 'Phylogeographic variation in recombination rates within a global clone of methicillin-resistant _Staphylococcus aureus_',
      pmid: '23270620',
      numberOfAssemblies: 145,
    },

    { id: 'b4o3iku66i6z',
      name: 'SA_003',
      author: 'Ellington _et al._ (2015)',
      title: 'Emergent and evolving antimicrobial resistance cassettes in community-associated fusidic acid and meticillin-resistant _Staphylococcus aureus_',
      pmid: '25769787',
      numberOfAssemblies: 23,
    },

    { id: 'gf8ftkvvskd7',
      name: 'SA_004',
      author: 'Harris _et al._ (2010)',
      title: 'Evolution of MRSA During Hospital Transmission and Intercontinental Spread',
      pmid: '20093474',
      numberOfAssemblies: 58,
    },

    { id: 't2nbcpwm6ont',
      name: 'SA_005',
      author: 'Harris _et al._ (2013)',
      title: 'Whole-genome sequencing for analysis of an outbreak of meticillin-resistant _Staphylococcus aureus_: a descriptive study',
      pmid: '23158674',
      numberOfAssemblies: 64,
    },

    { id: 'tdgzqah2n3mh',
      name: 'SA_006',
      author: 'Holden _et al._ (2013)',
      title: 'A genomic portrait of the emergence, evolution, and global spread of a methicillin-resistant _Staphylococcus aureus_ pandemic',
      pmid: '23299977',
      numberOfAssemblies: 192,
    },

    { id: 'o6p13yrog7xy',
      name: 'SA_007',
      author: 'Hsu _et al._ (2015)',
      title: 'Evolutionary dynamics of methicillin-resistant _Staphylococcus aureus_ within a healthcare system',
      pmid: '25903077',
      numberOfAssemblies: 258,
    },

    { id: 'a97l4irm2i2b',
      name: 'SA_008',
      author: 'Uhlemann _et al._ (2014)',
      title: 'Molecular tracing of the emergence, diversification, and transmission of _Staphylococcus aureus_ sequence type 8 in a New York community',
      pmid: '24753569',
      numberOfAssemblies: 387,
    },

    { id: 'pqmpmgp682sz',
      name: 'SA_009',
      author: 'Köser _et al._ (2012)',
      title: 'Rapid Whole-Genome Sequencing for Investigation of a Neonatal MRSA Outbreak',
      pmid: '22693998',
      numberOfAssemblies: 13,
    },

    { id: '5a7zt8vf7vyu',
      name: 'SA_011',
      author: 'Dordel _et al._ (2014)',
      title: 'Novel Determinants of Antibiotic Resistance: Identification of Mutated Loci in Highly Methicillin-Resistant Subpopulations of Methicillin-Resistant _Staphylococcus aureus_',
      pmid: '24713324',
      numberOfAssemblies: 54,
    },

    { id: 'xjyi62umm8by',
      name: 'SA_013',
      author: 'Török _et al._ (2014)',
      title: 'Zero tolerance for healthcare-associated MRSA bacteraemia: is it realistic?',
      pmid: '24788657',
      numberOfAssemblies: 52,
    },

    { id: 'kx8zouu666pj',
      name: 'SA_014',
      author: 'Tong _et al._ (2015)',
      title: 'Genome sequencing defines phylogeny and spread of methicillin-resistant _Staphylococcus aureus_ in a high transmission setting',
      pmid: '25491771',
      numberOfAssemblies: 171,
    },

    { id: '6rioktzb6nw9',
      name: 'SA_016',
      author: 'Paterson _et al._ (2015)',
      title: 'Capturing the cloud of diversity reveals complexity and heterogeneity of MRSA carriage, infection and transmission',
      pmid: '25814293',
      numberOfAssemblies: 373,
    },

    { id: '8shl40iywh2q',
      name: 'SA_017',
      author: 'Harrison _et al._ (2014)',
      title: 'A Shared Population of Epidemic Methicillin-Resistant _Staphylococcus aureus_ 15 Circulates in Humans and Companion Animals',
      pmid: '24825010',
      numberOfAssemblies: 62,
    },

    { id: 'joh87o3qymai',
      name: 'SA_018',
      author: 'Harrison _et al._ (2013)',
      title: 'Whole genome sequencing identifies zoonotic transmission of MRSA isolates with the novel mecA homologue mecC',
      pmid: '23526809',
      numberOfAssemblies: 7,
    },
  ],
};
