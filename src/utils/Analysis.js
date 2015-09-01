import UploadWorkspaceNavigationActionCreators from '../actions/UploadWorkspaceNavigationActionCreators.js';

var DNA_SEQUENCE_REGEX = /^[CTAGNUX]+$/i;

function extractContigsFromFastaFileString(fastaFileString) {
  var contigs = [];
  //
  // Trim, and split assembly string into array of individual contigs
  // then filter that array by removing empty strings
  //
  contigs = fastaFileString.trim().split('>').filter(function(element) {
    return (element.length > 0);
  });

  return contigs;
}

function splitContigIntoParts(contig) {
  var contigParts = [];

  // Split contig string into parts
  contigParts = contig.split(/\n/)
  // Filter out empty parts
  .filter(function(part){
    return (part.length > 0);
  });

  // Trim each contig part
  contigParts.map(function(contigPart){
    return contigPart.trim();
  });

  return contigParts;
}

function extractDnaStringIdFromContig(contig) {
  var contigParts = splitContigIntoParts(contig);

  // Parse DNA string id
  var dnaStringId = contigParts[0].trim().replace('>','');

  return dnaStringId;
}

function extractDnaStringFromContig(contig) {
  var contigParts = splitContigIntoParts(contig);
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
  var contigPartsWithNoIdAndDescription = contigParts.splice(1, contigParts.length);
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
};

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

  //
  // Deprecated: previously working solution
  //
  // // Calculate sums of all nucleotides in this assembly by adding current contig's length to the sum of all previous contig lengths
  // // Contig length === number of nucleotides in this contig
  // var assemblyNucleotideSums = [],
  //     // Count sorted dna sequence strings
  //     sortedDnaStringCounter = 0;

  // for (; sortedDnaStringCounter < sortedDnaStrings.length; sortedDnaStringCounter++) {
  //     if (assemblyNucleotideSums.length > 0) {
  //         // Add current contig's length to the sum of all previous contig lengths
  //         assemblyNucleotideSums.push(sortedDnaStrings[sortedDnaStringCounter].length + assemblyNucleotideSums[assemblyNucleotideSums.length - 1]);
  //     } else {
  //         // This is a "sum" of a single contig's length
  //         assemblyNucleotideSums.push(sortedDnaStrings[sortedDnaStringCounter].length);
  //     }
  // }
  // return assemblyNucleotideSums;
}

function validateContigs(contigs) {

  var validatedContigs = {
    valid: [],
    invalid: []
  };

  //
  // Validate each contig
  //
  contigs.forEach(function(contig, index, contigs) {

    var contigParts = splitContigIntoParts(contig);
    var dnaString = extractDnaStringFromContig(contig);
    var dnaStringId = extractDnaStringIdFromContig(contig);

    // Valid contig
    if (isValidContig(contig)) {
      validatedContigs.valid.push({
        id: dnaStringId,
        dnaString: dnaString
      });

      // Invalid contig
    } else {
      validatedContigs.invalid.push({
        id: dnaStringId,
        dnaString: dnaString
      });
    }
  });

  return validatedContigs;
}

function drawN50Chart(chartData, assemblyN50, appendToClass) {

  if (!chartData) {
    return;
  }

  var d3 = require('d3');

  var chartWidth = 460,
  chartHeight = 312;

  // Extent
  var xExtent = d3.extent(chartData, function(datum){
    return datum.sequenceLength;
  });

  // Scales

  // X
  var xScale = d3.scale.linear()
  .domain([0, chartData.length])
  .range([40, chartWidth - 100]); // the pixels to map, i.e. the width of the diagram

  // Y
  var yScale = d3.scale.linear()
  .domain([chartData[chartData.length - 1], 0])
  .range([30, chartHeight - 52]);

  // Axes

  // X
  var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .ticks(10);

  // Y
  var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  // http://stackoverflow.com/a/18822793
  .ticks(10);

  d3.select("svg").remove();

  // Append SVG to DOM
  var svg = d3.select(appendToClass)
  .append('svg')
  .attr('width', '100%')
  .attr('height', chartHeight);

  // Append axis

  // X
  svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(20, 260)')
  .call(xAxis);

  // Y
  svg.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(60, 0)')
  .call(yAxis);

  // Axis labels

  // X
  svg.select('.x.axis')
  .append('text')
  .text('Ordered contigs')
  .attr('class', 'axis-label')
  .attr('text-anchor', 'end')
  .attr('x', (chartWidth / 2))
  .attr('y', 45);

  // Y
  svg.select('.y.axis')
  .append('text')
  .text('Nucleotides sum')
  .attr('class', 'axis-label')
  .attr('transform', 'rotate(-90)')
  .attr('x', -(chartHeight / 2) - 44)
  .attr('y', chartWidth - 120);

  var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "white")
  .style("border", "1px solid")
  .style("border-color", "#ccc")
  .style("padding", "10px")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("tooltip");

  // Circles
  svg.selectAll('circle')
  .data(chartData)
  .enter()
  .append('circle')
  .attr('cx', function(datum, index){
    return xScale(index + 1) + 20;
  })
  .attr('cy', function(datum){
    return yScale(datum);
  })
  .attr('r', 5)
  .on("mouseover", function(datum, index){return tooltip.style("visibility", "visible").html('Sum: <b>' + datum + '</b>');})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

  // Line
  var line = d3.svg.line()
  //.interpolate("basis")
  .x(function(datum, index) {
    return xScale(index + 1) + 20;
  })
  .y(function(datum) {
    return yScale(datum);
  });

  svg.append('path')
  .attr('d', line(chartData));

  // Draw line from (0,0) to d3.max(data)
  var rootLineData = [{
    'x': xScale(0) + 20,
    'y': yScale(0)
  },
  {
    'x': xScale(1) + 20,
    'y': yScale(chartData[0])
  }];

  var rootLine = d3.svg.line()
  .x(function(datum) {
    return datum.x;
  })
  .y(function(datum) {
    return datum.y;
  })
  .interpolate("linear");

  var rootPath = svg.append('path')
  .attr('d', rootLine(rootLineData));

  // Draw N50

  /*          svg.selectAll('.n50-circle')
  .data([n50])
  .enter()
  .append('circle')
  .attr('cx', function(datum){
  return xScale(datum.index) + 20;
  })
  .attr('cy', function(datum){
  return yScale(datum.sum);
  })
  .attr('r', 6)
  .attr('class', 'n50-circle')*/

  // Group circle and text elements
  var n50Group = svg.selectAll('.n50-circle')
  .data([assemblyN50])
  .enter()
  .append('g')
  .attr('class', 'n50-group');

  // Append circle to group
  var n50Circle = n50Group.append('circle')
  .attr('cx', function(datum){
    return xScale(datum.sequenceNumber) + 20;
  })
  .attr('cy', function(datum){
    return yScale(datum.sum);
  })
  .attr('r', 6)
  .attr('class', 'n50-circle')
  .on("mouseover", function(datum, index){return tooltip.style("visibility", "visible").html('Sum: <b>' + datum.sum + '</b>' );})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

  // Append text to group
  n50Group.append('text')
  .attr('dx', function(datum){
    return xScale(datum.sequenceNumber) + 20 + 9;
  })
  .attr('dy', function(datum){
    return yScale(datum.sum) + 5;
  })
  .attr("text-anchor", 'right')
  .text('N50');
  //.attr('class', 'n50-text');

  // Draw N50 lines
  var d50LinesData = [{
    'x': 54,
    'y': yScale(assemblyN50.sum)
  },
  {
    'x': xScale(assemblyN50.sequenceNumber) + 20,
    'y': yScale(assemblyN50.sum)
  },
  {
    'x': xScale(assemblyN50.sequenceNumber) + 20,
    'y': chartHeight - 46
  }];

  var d50Line = d3.svg.line()
  .x(function(datum) {
    return datum.x;
  })
  .y(function(datum) {
    return datum.y;
  })
  .interpolate("linear");

  // N50 path
  n50Group.append('path').attr('d', d50Line(d50LinesData));
  // console.log(assemblyN50)
}

function drawN50OverviewChart(contigsN50Data, appendToClass) {

  if (!contigsN50Data) {
    return;
  }

  var d3 = require('d3');

  var className = appendToClass.replace(/^\./,"");
  var chartWidth = document.getElementsByClassName(className)[0].parentElement.offsetWidth;
  var chartHeight = 312;

  var chartData = [];
  for (const id in contigsN50Data) {
    if (contigsN50Data[id]) {
      chartData.push(contigsN50Data[id]);
    }
  }

  var chartXAxis = Object.keys(contigsN50Data);

  // Scales
  // console.log(chartData)
  // X
  var xScale = d3.scale.linear()
  .domain([0, chartData.length])
  .range([40, chartWidth - 100]); // the pixels to map, i.e. the width of the diagram

  // Y
  var yScale = d3.scale.linear()
  .domain([Math.max(...chartData), 0])
  .range([30, chartHeight - 52]);

  // Axes

  // X
  var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .ticks(chartXAxis.length);

  // Y
  var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  // http://stackoverflow.com/a/18822793
  .ticks(10);

  // Append SVG to DOM
  var svg = d3.select(appendToClass)
  .append('svg')
  .attr('width', '100%')
  .attr('height', chartHeight);

  // Append axis

  // X
  svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(20, 260)')
  .call(xAxis);

  // Y
  svg.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(60, 0)')
  .call(yAxis);

  // Axis labels

  // X
  svg.select('.x.axis')
  .append('text')
  .text('Assemblies')
  .attr('class', 'axis-label')
  .attr('text-anchor', 'end')
  .attr('x', (chartWidth / 2))
  .attr('y', 45);

  // Y
  svg.select('.y.axis')
  .append('text')
  .text('contig n50')
  .attr('class', 'axis-label')
  .attr('transform', 'rotate(-90)')
  .attr('x', -(chartHeight / 2) - 44)
  .attr('y', chartWidth - 120);

  var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "white")
  .style("border", "1px solid")
  .style("border-color", "#ccc")
  .style("padding", "10px")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("tooltip");

  // Circles
  svg.selectAll('circle')
  .data(chartData)
  .enter()
  .append('circle')
  .attr('cx', function(datum, index){
    return xScale(index + 1) + 20;
  })
  .attr('cy', function(datum){
    return yScale(datum);
  })
  .attr('r', 5)
  .on("mouseover", function(datum, index){return tooltip.style("visibility", "visible").html('Filename: <b>' + chartXAxis[index] + '</b><br>' + 'N50 Contig: <b>' + datum + '</b>');})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
  .on("click", function(datum, index){UploadWorkspaceNavigationActionCreators.navigateToAssembly(chartXAxis[index]); return tooltip.style("visibility", "hidden");});

  // // Line
  // var line = d3.svg.line()
  // //.interpolate("basis")
  // .x(function(datum, index) {
  //   return xScale(index + 1) + 20;
  // })
  // .y(function(datum) {
  //   return yScale(datum);
  // });

  // svg.append('path')
  // .attr('d', line(chartData));

  // // Draw line from (0,0) to d3.max(data)
  // var rootLineData = [{
  //   'x': xScale(0) + 20,
  //   'y': yScale(0)
  // },
  // {
  //   'x': xScale(1) + 20,
  //   'y': yScale(chartData[0])
  // }];

  // var rootLine = d3.svg.line()
  // .x(function(datum) {
  //   return datum.x;
  // })
  // .y(function(datum) {
  //   return datum.y;
  // })
  // .interpolate("linear");

  // var rootPath = svg.append('path')
  // .attr('d', rootLine(rootLineData));

  // Draw N50

  /*          svg.selectAll('.n50-circle')
  .data([n50])
  .enter()
  .append('circle')
  .attr('cx', function(datum){
  return xScale(datum.index) + 20;
  })
  .attr('cy', function(datum){
  return yScale(datum.sum);
  })
  .attr('r', 6)
  .attr('class', 'n50-circle')*/

  // Group circle and text elements
  // var n50Group = svg.selectAll('.n50-circle')
  // .data([assemblyN50])
  // .enter()
  // .append('g')
  // .attr('class', 'n50-group');

  // // Append circle to group
  // var n50Circle = n50Group.append('circle')
  // .attr('cx', function(datum){
  //   return xScale(datum.sequenceNumber) + 20;
  // })
  // .attr('cy', function(datum){
  //   return yScale(datum.sum);
  // })
  // .attr('r', 6);
  // //.attr('class', 'n50-circle');

  // // Append text to group
  // n50Group.append('text')
  // .attr('dx', function(datum){
  //   return xScale(datum.sequenceNumber) + 20 + 9;
  // })
  // .attr('dy', function(datum){
  //   return yScale(datum.sum) + 5;
  // })
  // .attr("text-anchor", 'right')
  // .text('N50');
  // //.attr('class', 'n50-text');

  // // Draw N50 lines
  // var d50LinesData = [{
  //   'x': 54,
  //   'y': yScale(assemblyN50.sum)
  // },
  // {
  //   'x': xScale(assemblyN50.sequenceNumber) + 20,
  //   'y': yScale(assemblyN50.sum)
  // },
  // {
  //   'x': xScale(assemblyN50.sequenceNumber) + 20,
  //   'y': chartHeight - 46
  // }];

  // var d50Line = d3.svg.line()
  // .x(function(datum) {
  //   return datum.x;
  // })
  // .y(function(datum) {
  //   return datum.y;
  // })
  // .interpolate("linear");

  // // N50 path
  // n50Group.append('path').attr('d', d50Line(d50LinesData));
}

module.exports = {
  extractContigsFromFastaFileString: extractContigsFromFastaFileString,
  splitContigIntoParts: splitContigIntoParts,
  extractDnaStringIdFromContig: extractDnaStringIdFromContig,
  extractDnaStringFromContig: extractDnaStringFromContig,
  extractDnaStringsFromContigs: extractDnaStringsFromContigs,
  isValidDnaString: isValidDnaString,
  isValidContig: isValidContig,
  calculateN50: calculateN50,
  calculateTotalNumberOfNucleotidesInDnaStrings: calculateTotalNumberOfNucleotidesInDnaStrings,
  calculateAverageNumberOfNucleotidesInDnaStrings: calculateAverageNumberOfNucleotidesInDnaStrings,
  calculateSmallestNumberOfNucleotidesInDnaStrings: calculateSmallestNumberOfNucleotidesInDnaStrings,
  calculateBiggestNumberOfNucleotidesInDnaStrings: calculateBiggestNumberOfNucleotidesInDnaStrings,
  calculateSumsOfNucleotidesInDnaStrings: calculateSumsOfNucleotidesInDnaStrings,
  validateContigs: validateContigs,
  drawN50Chart: drawN50Chart,
  drawN50OverviewChart: drawN50OverviewChart
};
