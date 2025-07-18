module.exports.transformer = function (doc) {

  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
  };

  if (!('kleborate' in doc.analysis)) {
    return record;
  }

  if ('versions' in doc.analysis.kleborate) {
    record['Kleborate version'] = doc.analysis.kleborate.versions.kleborate;
    record['Wrapper version'] = doc.analysis.kleborate.versions.wrapper;
  }

  const moduleMapping = {
    "enterobacterales__species": [
      "species",
      "species_match",
    ],
    "general__contig_stats": [
      "contig_count",
      "N50",
      "largest_contig",
      "total_size",
      "ambiguous_bases",
      "QC_warnings",
    ],
    "klebsiella_pneumo_complex__mlst": [
      "ST",
      "gapA",
      "infB",
      "mdh",
      "pgi",
      "phoE",
      "rpoB",
      "tonB",
    ],
    "klebsiella_oxytoca_complex__mlst": [
      "ST",
      "clonal_complex",
      "gapA",
      "infB",
      "mdh",
      "pgi",
      "phoE",
      "rpoB",
      "tonB",
    ],
    "klebsiella__ybst": [
      "YbST",
      "Yersiniabactin",
      "ybtS",
      "ybtX",
      "ybtQ",
      "ybtP",
      "ybtA",
      "irp2",
      "irp1",
      "ybtU",
      "ybtT",
      "ybtE",
      "fyuA",
      "spurious_ybt_hits",
    ],
    "klebsiella__cbst": [
      "CbST",
      "Colibactin",
      "clbA",
      "clbB",
      "clbC",
      "clbD",
      "clbE",
      "clbF",
      "clbG",
      "clbH",
      "clbI",
      "clbL",
      "clbM",
      "clbN",
      "clbO",
      "clbP",
      "clbQ",
      "spurious_clb_hits",
    ],
    "klebsiella__abst": [
      "AbST",
      "Aerobactin",
      "iucA",
      "iucB",
      "iucC",
      "iucD",
      "iutA",
      "spurious_abst_hits",
    ],
    "klebsiella__smst": [
      "SmST",
      "Salmochelin",
      "iroB",
      "iroC",
      "iroD",
      "iroN",
      "spurious_smst_hits",

    ],
    "klebsiella__rmst": [
      "RmST",
      "RmpADC",
      "rmpA",
      "rmpD",
      "rmpC",
      "spurious_rmst_hits",
    ],
    "klebsiella__rmpa2": [ "rmpA2" ],
    "klebsiella_pneumo_complex__virulence_score": [ "virulence_score", "spurious_virulence_hits" ],
    "klebsiella_pneumo_complex__amr": [
      "AGly_acquired",
      "Col_acquired",
      "Fcyn_acquired",
      "Flq_acquired",
      "Gly_acquired",
      "MLS_acquired",
      "Phe_acquired",
      "Rif_acquired",
      "Sul_acquired",
      "Tet_acquired",
      "Tgc_acquired",
      "Tmt_acquired",
      "Bla_acquired",
      "Bla_inhR_acquired",
      "Bla_ESBL_acquired",
      "Bla_ESBL_inhR_acquired",
      "Bla_Carb_acquired",
      "Bla_chr",
      "SHV_mutations",
      "Omp_mutations",
      "Col_mutations",
      "Flq_mutations",
      "truncated_resistance_hits",
      "spurious_resistance_hits",
    ],
    "klebsiella_pneumo_complex__resistance_score": [ "resistance_score" ],
    "klebsiella_pneumo_complex__resistance_class_count": [ "num_resistance_classes" ],
    "klebsiella_pneumo_complex__resistance_gene_count": [ "num_resistance_genes" ],
    "klebsiella_pneumo_complex__cipro_prediction": [
      "Ciprofloxacin_prediction",
      "Ciprofloxacin_profile_support",
      "Ciprofloxacin_profile",
      "Ciprofloxacin_MIC_prediction",
    ],
    "klebsiella_pneumo_complex__wzi": [ "wzi" ],
    "klebsiella_pneumo_complex__kaptive": [
      "K_locus",
      "K_type",
      "K_locus_confidence",
      "K_locus_problems",
      "K_locus_identity",
      "K_Missing_expected_genes",
      "O_locus",
      "O_type",
      "O_locus_confidence",
      "O_locus_problems",
      "O_locus_identity",
      "O_Missing_expected_genes",
    ],
  };

  const virulenceFields = new Set(
    [
      "spurious_ybt_hits",
      "spurious_clb_hits",
      "spurious_abst_hits",
      "spurious_smst_hits",
      "spurious_rmst_hits",
      "virulence_score",
      "spurious_virulence_hits",

    ]
  );
  const virulenceProfileFields = new Set(
    [
      "YbST",
      "Yersiniabactin",
      "CbST",
      "Colibactin",
      "AbST",
      "Aerobactin",
      "SmST",
      "Salmochelin",
      "RmST",
      "RmpADC",
      "rmpA2",
    ]
  );
  const virulenceMarkerFields = new Set([
    "ybtS",
    "ybtX",
    "ybtQ",
    "ybtP",
    "ybtA",
    "irp2",
    "irp1",
    "ybtU",
    "ybtT",
    "ybtE",
    "fyuA",
    "clbA",
    "clbB",
    "clbC",
    "clbD",
    "clbE",
    "clbF",
    "clbG",
    "clbH",
    "clbI",
    "clbL",
    "clbM",
    "clbN",
    "clbO",
    "clbP",
    "clbQ",
    "iucA",
    "iucB",
    "iucC",
    "iucD",
    "iutA",
    "iroB",
    "iroC",
    "iroD",
    "iroN",
    "rmpA",
    "rmpD",
    "rmpC",
  ]);
  const amrFields = new Set(
    [
      "truncated_resistance_hits",
      "spurious_resistance_hits",
      "resistance_score",
      "num_resistance_classes",
      "num_resistance_genes",
    ]
  );
  const amrClassesFields = new Set(
    [
      "AGly_acquired",
      "Col_acquired",
      "Fcyn_acquired",
      "Flq_acquired",
      "Gly_acquired",
      "MLS_acquired",
      "Phe_acquired",
      "Rif_acquired",
      "Sul_acquired",
      "Tet_acquired",
      "Tgc_acquired",
      "Tmt_acquired",
      "Bla_acquired",
      "Bla_inhR_acquired",
      "Bla_ESBL_acquired",
      "Bla_ESBL_inhR_acquired",
      "Bla_Carb_acquired",
      "Bla_chr",
      "SHV_mutations",
      "Omp_mutations",
      "Col_mutations",
      "Flq_mutations",
    ]
  );

  "kleborate" in doc.analysis && "modules" in doc.analysis.kleborate && doc.analysis.kleborate.modules.forEach((module) => {
    moduleMapping[module].forEach((field) => {
      if (virulenceFields.has(field)) {
        record[field] = doc.analysis.kleborate.virulence[field];
      } else if (virulenceMarkerFields.has(field)) {
        record[field] = doc.analysis.kleborate.virulence.markers[field];
      } else if (virulenceProfileFields.has(field)) {
        record[field] = doc.analysis.kleborate.virulence.profile[field];
      } else if (amrFields.has(field)) {
        record[field] = doc.analysis.kleborate.amr[field];
      } else if (amrClassesFields.has(field)) {
        record[field] = doc.analysis.kleborate.amr.classes[field];
      } else {
        record[field] = doc.analysis.kleborate[field];
      }
    });
  });

  return record;
};
