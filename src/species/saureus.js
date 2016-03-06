import React from 'react';

const formattedName = (<em>Staphylococcus aureus</em>);
const shortFormattedName = (<em>S. aureus</em>);

export default {
  id: '1280',
  nickname: 'saureus',
  formattedName,
  shortFormattedName,
  imagePath: '/assets/img/saureus.jpg',
  definitionText: (
    <span>
      <strong>{formattedName}</strong>, a gram-positive coccal bacterium.
    </span>
  ),
  active: true,
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
      <p><strong>{formattedName}</strong>, is a gram-positive microorganism of prominent versatility. While the nasal colonization by S. aureus is fairly widespread and occurs asymptomatically, S. aureus can also transform into a pathogen causing a diverse infections ranging from mild skin infections to life-threatening conditions.</p>
      <p>{shortFormattedName} in its methicillin-sensitive (MSSA) form but especially in its methicillin-resistant (MRSA) or even multi-resistant form are threatening the community and healthcare system worldwide and it has reached the status of being one of the most common causative agents for infectious disease.</p>
      <p>News agencies have been calling MRSA the superbug in recent years and thus it is of no surprise that agencies like the WHO, CDC and ECDC (Ears-Net) include S. aureus in their list of target species in their reports.</p>
      <p>With the new revolution of whole genome sequencing the identification and tracking of high-risk clones and epidemiological investigations, outbreak and transmission prevention and control will be made possible in a timely manner.</p>
    </span>
  ),
  collections: [
    { id: '3ilqyonbg2y6',
      name: 'SA_001_004',
      author: (<span>Castillo-Ramirez <em>et al.</em> (2012)</span>),
      size: 145,
      title: (
        <span>Phylogeographic variation in recombination rates within a global clone of methicillin-resistant <em>Staphylococcus aureus</em> </span>
      ),
      pmid: '23270620',
    },

    { id: '9ywvf45o6bf8',
      name: 'SA_003',
      author: (<span>Ellington <em>et al.</em> (2015)</span>),
      size: 23,
      title: (
        <span>Emergent and evolving antimicrobial resistance cassettes in community-associated fusidic acid and meticillin-resistant <em>Staphylococcus aureus</em></span>
      ),
      pmid: '25769787',
    },

    { id: '49511lury364',
      name: 'SA_004',
      author: (<span>Harris <em>et al.</em> (2010)</span>),
      size: 58,
      title: (
        <span>Evolution of MRSA During Hospital Transmission and Intercontinental Spread</span>
      ),
      pmid: '20093474',
    },

    { id: 'xfhpgz421my4',
      name: 'SA_015',
      author: (<span>Harris <em>et al.</em> (2013)</span>),
      size: 65,
      title: (
        <span>Whole-genome sequencing for analysis of an outbreak of meticillin-resistant <em>Staphylococcus aureus</em>: a descriptive study</span>
      ),
      pmid: '23158674',
    },

    { id: 'hbflqwalb4ed',
      name: 'SA_006',
      author: (<span>Holden <em>et al.</em> (2013)</span>),
      size: 192,
      title: (
        <span>A genomic portrait of the emergence, evolution, and global spread of a methicillin-resistant <em>Staphylococcus aureus</em> pandemic</span>
      ),
      pmid: '23299977',
    },

    { id: 'vdlaxlgsewne',
      name: 'SA_007',
      author: (<span>Hsu <em>et al.</em> (2015)</span>),
      size: 259,
      title: (
        <span>Evolutionary dynamics of methicillin-resistant <em>Staphylococcus aureus</em> within a healthcare system</span>
      ),
      pmid: '25903077',
    },

    { id: '4hu48x8k5utj',
      name: 'SA_009',
      author: (<span>Köser <em>et al.</em> (2012)</span>),
      size: 13,
      title: (
        <span>Rapid Whole-Genome Sequencing for Investigation of a Neonatal MRSA Outbreak</span>
      ),
      pmid: '22693998',
    },

    { id: '3rah4h2d1r8x',
      name: 'SA_011',
      author: (<span>Dordel <em>et al.</em> (2014)</span>),
      size: 54,
      title: (
        <span>Novel Determinants of Antibiotic Resistance: Identification of Mutated Loci in Highly Methicillin-Resistant Subpopulations of Methicillin-Resistant <em>Staphylococcus aureus</em></span>
      ),
      pmid: '24713324',
    },

    { id: 'wwr9m7afcuds',
      name: 'SA_017',
      author: (<span>Harrison <em>et al.</em> (2014)</span>),
      size: 68,
      title: (
        <span>A Shared Population of Epidemic Methicillin-Resistant <em>Staphylococcus aureus</em> 15 Circulates in Humans and Companion Animals</span>
      ),
      pmid: '24825010',
    },

    { id: 'w0qna0wxt1k9',
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
