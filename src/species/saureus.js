import React from 'react';

const formattedName = (<em>Staphylococcus aureus</em>);

export default {
  id: '1280',
  nickname: 'saureus',
  formattedName,
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
      <p>S. aureus in its methicillin-sensitive (MSSA) form but especially in its methicillin-resistant (MRSA) or even multi-resistant form are threatening the community and healthcare system worldwide and it has reached the status of being one of the most common causative agents for infectious disease.</p>
      <p>News agencies have been calling MRSA the superbug in recent years and thus it is of no surprise that agencies like the WHO, CDC and ECDC (Ears-Net) include S. aureus in their list of target species in their reports.</p>
      <p>With the new revolution of whole genome sequencing the identification and tracking of high-risk clones and epidemiological investigations, outbreak and transmission prevention and control will be made possible in a timely manner.</p>
    </span>
  ),
};
