const DNA_SEQUENCE_REGEX = /^[CTAGNUX]+$/i;

function extractContigsFromFastaFileString(fastaFileString) {
  //
  // Trim, and split assembly string into array of individual contigs
  // then filter that array by removing empty strings
  //
  return fastaFileString.trim().split('>').filter(function (element) {
    return (element.length > 0);
  });
}

function splitContigIntoParts(contig) {
  // Split contig string into parts
  return contig.split(/\n/)
    .filter(function (part) {
      // Filter out empty parts
      return (part.length > 0);
    })
    .map(function (contigPart) {
      return contigPart.trim();
    });
}

function extractDnaStringIdFromContig(contig) {
  const contigParts = splitContigIntoParts(contig);

  // Parse DNA string id
  return contigParts[0].trim().replace('>', '');
}

function extractDnaStringFromContig(contig) {
  const contigParts = splitContigIntoParts(contig);
  //
  // DNA sequence can contain:
  // 1) [CTAGNUX] characters.
  // 2) White spaces (e.g.: new line characters).
  //
  // The first line of FASTA file contains id and description.
  // The second line theoretically contains comments (starts with #).
  //
  // To parse FASTA file you need to:
  // 1. Separate assembly into individual contigs by splitting file's content by > character.
  //    Note: id and description can contain > character.
  // 2. For each sequence: split it by a new line character,
  //    then convert resulting array to string ignoring the first (and rarely the second) element of that array.
  //
  // -----------------------------
  // Parse DNA sequence string
  // -----------------------------
  //
  // Create sub array of the contig parts array - cut the first element (id and description).
  let contigPartsWithNoIdAndDescription = contigParts.splice(1, contigParts.length);
  //
  // Very rarely the second line can be a comment
  // If the first element won't match regex then assume it is a comment
  //
  if (! DNA_SEQUENCE_REGEX.test(contigPartsWithNoIdAndDescription[0].trim())) {
    // Remove comment element from the array
    contigPartsWithNoIdAndDescription = contigPartsWithNoIdAndDescription.splice(1, contigPartsWithNoIdAndDescription.length);
  }
  //
  // Contig string without id, description, comment is only left with DNA sequence string(s).
  //
  //
  // Convert array of DNA sequence substrings into a single string
  // Remove whitespace
  //
  var dnaString = contigPartsWithNoIdAndDescription.join('').replace(/\s/g, '');

  return dnaString;
}

function extractDnaStringsFromContigs(contigs) {
  var dnaStrings = [],
  dnaString;
  contigs.forEach(function(contig) {
    dnaString = extractDnaStringFromContig(contig);
    dnaStrings.push(dnaString);
  });
  return dnaStrings;
}

function isValidDnaString(dnaString) {
  return DNA_SEQUENCE_REGEX.test(dnaString);
}

function isValidContig(contig) {
  var contigParts = splitContigIntoParts(contig);
  var dnaString = extractDnaStringFromContig(contig);

  return (contigParts.length > 1 && isValidDnaString(dnaString));
}

function calculateN50(dnaSequenceStrings) {
  //
  // Calculate N50
  // http://www.nature.com/nrg/journal/v13/n5/box/nrg3174_BX1.html
  //

  // Order array by sequence length DESC
  var sortedDnaSequenceStrings = dnaSequenceStrings.sort(function(a, b){
    return b.length - a.length;
  });

  // Calculate sums of all nucleotides in this assembly by adding current contig's length to the sum of all previous contig lengths
  // Contig length === number of nucleotides in this contig
  var assemblyNucleotideSums = [],
  // Count sorted dna sequence strings
  sortedDnaSequenceStringCounter = 0;

  for (; sortedDnaSequenceStringCounter < sortedDnaSequenceStrings.length; sortedDnaSequenceStringCounter++) {
    if (assemblyNucleotideSums.length > 0) {
      // Add current contig's length to the sum of all previous contig lengths
      assemblyNucleotideSums.push(sortedDnaSequenceStrings[sortedDnaSequenceStringCounter].length + assemblyNucleotideSums[assemblyNucleotideSums.length - 1]);
    } else {
      // This is a "sum" of a single contig's length
      assemblyNucleotideSums.push(sortedDnaSequenceStrings[sortedDnaSequenceStringCounter].length);
    }
  }

  // Calculate one-half of the total sum of all nucleotides in the assembly
  var assemblyNucleotidesHalfSum = Math.floor(assemblyNucleotideSums[assemblyNucleotideSums.length - 1] / 2);

  //
  // Sum lengths of every contig starting from the longest contig
  // until this running sum equals one-half of the total length of all contigs in the assembly.
  //

  // Store nucleotides sum
  var assemblyNucleotidesSum = 0,
  // N50 object
  assemblyN50 = {},
  // Count again sorted dna sequence strings
  sortedDnaSequenceStringCounter = 0;

  for (; sortedDnaSequenceStringCounter < sortedDnaSequenceStrings.length; sortedDnaSequenceStringCounter++) {
    // Update nucleotides sum
    assemblyNucleotidesSum = assemblyNucleotidesSum + sortedDnaSequenceStrings[sortedDnaSequenceStringCounter].length;
    // Contig N50 of an assembly is the length of the shortest contig in this list
    // Check if current sum of nucleotides is greater or equals to half sum of nucleotides in this assembly
    if (assemblyNucleotidesSum >= assemblyNucleotidesHalfSum) {
      assemblyN50['sequenceNumber'] = sortedDnaSequenceStringCounter + 1;
      assemblyN50['sum'] = assemblyNucleotidesSum;
      assemblyN50['sequenceLength'] = sortedDnaSequenceStrings[sortedDnaSequenceStringCounter].length;
      break;
    }
  }

  return assemblyN50;
}

function calculateTotalNumberOfNucleotidesInDnaStrings(dnaStrings) {
  var totalNumberOfNucleotidesInDnaStrings = 0;
  dnaStrings.forEach(function(dnaString, index, array){
    totalNumberOfNucleotidesInDnaStrings = totalNumberOfNucleotidesInDnaStrings + dnaString.length;
  });
  return totalNumberOfNucleotidesInDnaStrings;

  //
  // Reduce doesn't seem to work as expected
  //
  // var totalNumberOfNucleotidesInDnaStrings = dnaStrings.reduce(function(previousDnaString, currentDnaString, index, array) {
  //     return previousDnaString.length + currentDnaString.length;
  // }, '');
  // return totalNumberOfNucleotidesInDnaStrings;
}

function calculateTotalNumberOfNsInDnaStrings(dnaStrings) {
  var totalNumberOfNsInDnaStrings = 0;
  dnaStrings.forEach(function(dnaString, index, array){
    totalNumberOfNsInDnaStrings = totalNumberOfNsInDnaStrings + (dnaString.match(/[^ACGT]/g) || []).length;
  });
  return totalNumberOfNsInDnaStrings;
}

function calculateAverageNumberOfNucleotidesInDnaStrings(dnaStrings) {
  var totalNumberOfNucleotidesInDnaStrings = calculateTotalNumberOfNucleotidesInDnaStrings(dnaStrings);
  var numberOfDnaStrings = dnaStrings.length;
  var averageNumberOfNucleotidesInDnaStrings = Math.floor(totalNumberOfNucleotidesInDnaStrings / numberOfDnaStrings);
  return averageNumberOfNucleotidesInDnaStrings;
}

function calculateSmallestNumberOfNucleotidesInDnaStrings(dnaStrings) {
  var numberOfNucleotidesInDnaStrings = dnaStrings.map(function(dnaString){
    return dnaString.length;
  });
  var smallestNumberOfNucleotidesInDnaStrings = numberOfNucleotidesInDnaStrings.reduce(function(previousNumberOfNucleotidesInDnaString, currentNumberOfNucleotidesInDnaString, index, array){
    return Math.min(previousNumberOfNucleotidesInDnaString, currentNumberOfNucleotidesInDnaString);
  });
  return smallestNumberOfNucleotidesInDnaStrings;
}

function calculateBiggestNumberOfNucleotidesInDnaStrings(dnaStrings) {
  var numberOfNucleotidesInDnaStrings = dnaStrings.map(function(dnaString){
    return dnaString.length;
  });
  var biggestNumberOfNucleotidesInDnaStrings = numberOfNucleotidesInDnaStrings.reduce(function(previousNumberOfNucleotidesInDnaString, currentNumberOfNucleotidesInDnaString, index, array){
    return Math.max(previousNumberOfNucleotidesInDnaString, currentNumberOfNucleotidesInDnaString);
  });
  return biggestNumberOfNucleotidesInDnaStrings;
}

function calculateSumsOfNucleotidesInDnaStrings(dnaStrings) {
  //
  // Get array of sums: [1, 2, 3, 6, 12, etc]
  //

  //
  // Sort dna strings by their length
  //
  var sortedDnaStrings = dnaStrings.sort(function(a, b){
    return b.length - a.length;
  });

  //
  // Calculate sums of all nucleotides in this assembly by adding current contig's length to the sum of all previous contig lengths
  //
  var sumsOfNucleotidesInDnaStrings = [];
  sortedDnaStrings.forEach(function(sortedDnaString, index, array){
    if (sumsOfNucleotidesInDnaStrings.length === 0) {
      sumsOfNucleotidesInDnaStrings.push(sortedDnaString.length);
    } else {
      sumsOfNucleotidesInDnaStrings.push(sortedDnaString.length + sumsOfNucleotidesInDnaStrings[sumsOfNucleotidesInDnaStrings.length - 1]);
    }
  });

  return sumsOfNucleotidesInDnaStrings;
}

function validateContigs(contigs) {
  var validatedContigs = {
    valid: [],
    invalid: []
  };

  //
  // Validate each contig
  //
  contigs.forEach(function (contig, index, contigs) {
    var contigParts = splitContigIntoParts(contig);
    var dnaString = extractDnaStringFromContig(contig);
    var dnaStringId = extractDnaStringIdFromContig(contig);

    // Valid contig
    if (isValidContig(contig)) {
      validatedContigs.valid.push({
        id: dnaStringId,
        dnaString: dnaString,
      });

      // Invalid contig
    } else {
      validatedContigs.invalid.push({
        id: dnaStringId,
        dnaString: dnaString,
      });
    }
  });

  return validatedContigs;
}

function analyseFasta(assemblyName, fastaFileString) {
  const contigs = extractContigsFromFastaFileString(fastaFileString);
  const dnaStrings = extractDnaStringsFromContigs(contigs);
  const assemblyN50Data = calculateN50(dnaStrings);

  return {
    totalNumberOfContigs: contigs.length,
    dnaStrings,
    assemblyN50Data,
    contigN50: assemblyN50Data.sequenceLength,
    sumsOfNucleotidesInDnaStrings: calculateSumsOfNucleotidesInDnaStrings(dnaStrings),
    totalNumberOfNucleotidesInDnaStrings: calculateTotalNumberOfNucleotidesInDnaStrings(dnaStrings),
    totalNumberOfNsInDnaStrings: calculateTotalNumberOfNsInDnaStrings(dnaStrings),
    averageNumberOfNucleotidesInDnaStrings: calculateAverageNumberOfNucleotidesInDnaStrings(dnaStrings),
    smallestNumberOfNucleotidesInDnaStrings: calculateSmallestNumberOfNucleotidesInDnaStrings(dnaStrings),
    biggestNumberOfNucleotidesInDnaStrings: calculateBiggestNumberOfNucleotidesInDnaStrings(dnaStrings),
  };
}

export default {
  analyseFasta,
};
