var Papa = require('papaparse');
var newickParser = require('biojs-io-newick');

var DATA_OBJECT_ID_REGEX = /[.'"]/g;
var MAXIMUM_OBJECT_ID_LENGTH = 100;

function parseCsvToJson(csv) {
  var results = Papa.parse(csv, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true
  });

  if (results.errors.length > 0) {
    console.error('[Microreact] Errors during CSV to JSON conversion:');
    console.dir(results.errors);
  }

  results.data = convertDataObjectsFieldNamesToLowerCase(results.data);
  return results;
}

function convertCsvToJson(csv) {
  return parseCsvToJson(csv).data;
}

function isValidCsvFormat(csv) {
  var results = parseCsvToJson(csv);

  return !(results.errors.length > 0);
}

function convertDataObjectsFieldNamesToLowerCase(dataObjects) {
  return dataObjects.map(convertDataObjectFieldNamesToLowerCase);
}

function convertDataObjectFieldNamesToLowerCase(dataObject) {
  var fieldNames = Object.keys(dataObject);
  var fieldNamesCounter = 0;
  var dataObjectWithLowerCaseFieldNames = {};
  var fieldName;

  while (fieldNamesCounter < fieldNames.length) {
    fieldName = fieldNames[fieldNamesCounter];
    dataObjectWithLowerCaseFieldNames[fieldName.toLowerCase()] = dataObject[fieldName];
    fieldNamesCounter = fieldNamesCounter + 1;
  }

  return dataObjectWithLowerCaseFieldNames;
}

function doesDataFieldEndsWithSuffix(dataField, suffix) {
  return (dataField.indexOf(suffix, dataField.length - suffix.length) !== -1);
}

function doesDataFieldHaveShape(dataField) {
  return doesDataFieldEndsWithSuffix(dataField, '__shape');
}

function doesDataFieldHaveColour(dataField) {
  return doesDataFieldEndsWithSuffix(dataField, '__colour') || doesDataFieldEndsWithSuffix(dataField, '__color');
}

function isDataFieldAMetaColumn(dataField) {
  return (
    doesDataFieldHaveShape(dataField) ||
    doesDataFieldHaveColour(dataField)
  );
}

function findWhichDataFieldsShouldFilterNodeLabels(dataObjects) {
  var dataObjectIds = Object.keys(dataObjects);
  var dataObject = dataObjects[dataObjectIds[0]];

  return Object.keys(dataObject)
          .map(function (dataField) {
            return dataField.toLowerCase();
          })
          .filter(function (dataField) {
            return !isMetaField(dataField);
          });
}

function findWhichDataFieldsShouldFilterMapMarkers(dataObjects) {
  var dataFieldsThatFilterMapMarkers = {};
  var dataObjectIds = Object.keys(dataObjects);
  var dataObject = dataObjects[dataObjectIds[0]];
  var dataObjectFields = Object.keys(dataObject);
  var cleanDataObjectFieldName;

  dataObjectFields.forEach(function (dataObjectField) {

    if (doesDataFieldHaveShape(dataObjectField)) {

      cleanDataObjectFieldName = dataObjectField.replace('__shape', '');
      dataFieldsThatFilterMapMarkers[cleanDataObjectFieldName] = true;

    } else if (doesDataFieldHaveColour(dataObjectField)) {

      cleanDataObjectFieldName = dataObjectField.replace('__colour', '').replace('__color', '');
      dataFieldsThatFilterMapMarkers[cleanDataObjectFieldName] = true;

    }
  });

  return Object.keys(dataFieldsThatFilterMapMarkers);
}

function isMetaField(fieldName) {
  return (fieldName.indexOf('__') !== -1);
}

function getMetaFieldNames(dataObjects) {
  var metaFields = [];
  var firstDataObject = dataObjects[0];
  var dataObjectFields = Object.keys(firstDataObject);

  dataObjectFields.forEach(function (dataObjectField) {
    if (isMetaField(dataObjectField)) {
      metaFields.push(dataObjectField);
    }
  });

  return metaFields;
}

function isValidNewickFormat(newick) {
  var isValid = true;

  try {
    var json = newickParser.parse_newick(newick);
  } catch (error) {
    isValid = false;
  }

  return isValid;
}

function convertNewickToJson(newick) {
  var json;

  try {
    json = newickParser.parse_newick(newick);
  } catch (error) {
    console.error('[Microreact] Invalid newick');
  }

  return json;
}

var leafNames;

function parseLeafName(leafObject) {
  if (leafObject.hasOwnProperty('children')) {
    leafObject.children.forEach(parseLeafName);
  } else {
    leafNames.push(leafObject.name.toString());
  }
}

function getLeafNamesInNewick(newick) {
  var json = convertNewickToJson(newick);

  leafNames = [];
  parseLeafName(json);

  return leafNames;
}

function getCsvFieldNames(csv) {
  var parsedCsv = parseCsvToJson(csv);
  var csvFieldNames = [];

  if (parsedCsv.data.length > 0) {
    csvFieldNames = parsedCsv.data.map(function (dataObject) {
      dataObject = convertDataObjectFieldNamesToLowerCase(dataObject);
      return getDataObject__Id(dataObject).toString();
    });
  }

  return csvFieldNames;
}

function isCsvFieldNamesAndNewickLeafNamesMatch(csv, newick) {
  var fieldsThatDontMatch = [];
  fieldsThatDontMatch = getCsvFieldNamesAndNewickLeafNamesThatDontMatch(csv, newick);
  return (fieldsThatDontMatch.totalNumberOfMissingFields === 0);
}

function getCsvFieldNamesAndNewickLeafNamesThatDontMatch(csv, newick) {
  var csvFieldNames = getCsvFieldNames(csv);
  var newickLeafNames = getLeafNamesInNewick(newick);
  var fieldsThatAreMissingInCsv = [];
  var fieldsThatAreMissingInNewick = [];

  fieldsThatAreMissingInCsv = newickLeafNames.filter(function (newickLeafName) {
    return (csvFieldNames.indexOf(newickLeafName) === -1);
  });

  fieldsThatAreMissingInNewick = csvFieldNames.filter(function (csvFieldName) {
    return (newickLeafNames.indexOf(csvFieldName) === -1);
  });

  return {
    fieldsThatAreMissingInCsv: fieldsThatAreMissingInCsv,
    fieldsThatAreMissingInNewick: fieldsThatAreMissingInNewick,
    totalNumberOfMissingFields: fieldsThatAreMissingInCsv.length + fieldsThatAreMissingInNewick.length
  };
}

function isDataObjectHasValidLatitude(dataObject) {
  var latitude = dataObject.__latitude;

  if (typeof latitude === 'undefined') {
    return false;
  }

  latitude = parseFloat(latitude);

  if (latitude < -90 || latitude > 90) {
    return false;
  }

  return true;
}

function isDataObjectHasValidLongitude(dataObject) {
  var longitude = dataObject.__longitude;

  if (typeof longitude === 'undefined') {
    return false;
  }

  longitude = parseFloat(longitude);

  if (longitude < -180 || longitude > 180) {
    return false;
  }

  return true;
}

function isAllDataObjectsHaveValidLatitudeAndLongitude(dataObjects) {
  var dataObjectsWithInvalidLatitude = dataObjects.filter(function (dataObject) {
    return !isDataObjectHasValidLatitude(dataObject);
  });

  var dataObjectsWithInvalidLongitude = dataObjects.filter(function (dataObject) {
    return !isDataObjectHasValidLongitude(dataObject);
  });

  return (dataObjectsWithInvalidLatitude.length === 0 && dataObjectsWithInvalidLongitude.length === 0);
}

function isCsvHasValidLatitudeAndLongitude(csv) {
  var dataObjects = convertCsvToJson(csv);
  dataObjects = convertDataObjectsFieldNamesToLowerCase(dataObjects);

  return isAllDataObjectsHaveValidLatitudeAndLongitude(dataObjects);
}

function doesDataObjectHaveAnyId(dataObject) {
  var dataObjectId = getDataObject__Id(dataObject);

  if (typeof dataObjectId === 'undefined') {
    return false;
  }

  return true;
}

function doesDataObjectIdContainIllegalCharacters(dataObject) {
  var dataObjectId = getDataObject__Id(dataObject);

  if (DATA_OBJECT_ID_REGEX.test(dataObjectId)) {
    return true;
  }

  return false;
}

function isDataObjectIdTooLong(dataObject) {
  var dataObjectId = getDataObject__Id(dataObject);

  if (dataObjectId.length > MAXIMUM_OBJECT_ID_LENGTH) {
    return true;
  }

  return false;
}

function doesDataObjectHaveValidId(dataObject) {

  if (! doesDataObjectHaveAnyId(dataObject)) {
    return false;
  }

  if (isDataObjectIdTooLong(dataObject)) {
    return false;
  }

  if (doesDataObjectIdContainIllegalCharacters(dataObject)) {
    return false;
  }

  return true;
}

function doDataObjectsHaveValidIds(dataObjects) {
  var dataObjectsWithInvalidIds = dataObjects.filter(function (dataObject) {
    return ! doesDataObjectHaveValidId(dataObject);
  });

  if (dataObjectsWithInvalidIds.length > 0) {
    return false;
  }

  var uniqueDataObjectIds = [];

  dataObjects.forEach(function (dataObject) {
    uniqueDataObjectIds.push(getDataObject__Id(dataObject));
  });

  var numberOfUniqueDataObjectIds = uniqueDataObjectIds.length;

  return (dataObjects.length === numberOfUniqueDataObjectIds);
}

function validateDataObjectId(dataObject) {
  var dataObjectId = getDataObject__Id(dataObject);

  if (! doesDataObjectHaveAnyId(dataObject)) {
    return ('One of the rows is missing id.');
  }

  if (isDataObjectIdTooLong(dataObject)) {
    return (dataObjectId + ' id is too long. The maximum length is ' + MAXIMUM_OBJECT_ID_LENGTH + ' characters.');
  }

  if (doesDataObjectIdContainIllegalCharacters(dataObject)) {
    return (dataObjectId + ' id has illegal characters. Do not use \', \", or \, characters.');
  }

  return null;
}

function validateDataObjectsIds(dataObjects) {
  var errors = [];
  var error;

  dataObjects.forEach(function (dataObject) {
    error = validateDataObjectId(dataObject);

    if (error) {
      errors.push(error);
    }
  });

  return errors;
}

function validateCsvIds(csv) {
  var dataObjects = convertCsvToJson(csv);
  dataObjects = convertDataObjectsFieldNamesToLowerCase(dataObjects);

  return validateDataObjectsIds(dataObjects);
}

function isCsvHasValidIds(csv) {
  var dataObjects = convertCsvToJson(csv);
  dataObjects = convertDataObjectsFieldNamesToLowerCase(dataObjects);

  return doDataObjectsHaveValidIds(dataObjects);
}

function convertDataObjectToArray(data) {
  var dataObjectIds = Object.keys(data);
  var dataObjects = [];
  var dataObject;

  dataObjects = dataObjectIds.map(function (dataObjectId) {
    dataObject = data[dataObjectId];

    return dataObject;
  });

  return dataObjects;
}

function hasMetaField(dataObject, metaField) {
  var meta = dataObject['__' + metaField];
  return (typeof meta !== 'undefined');
}

function hasYearMetaField(dataObject) {
  return hasMetaField(dataObject, 'year');
}

function hasMonthMetaField(dataObject) {
  return hasMetaField(dataObject, 'month');
}

function hasDayMetaField(dataObject) {
  return hasMetaField(dataObject, 'day');
}

function dataHasDateMetaFields(dataObjects) {
  return dataObjects.some(hasYearMetaField);
}

function dataObjectsHaveSameColorValue(field, dataObjects) {
  var firstDataObject = dataObjects[0];
  var isSpellingColor = (typeof firstDataObject[field + '__color'] !== 'undefined');
  var isSpellingColour = (typeof firstDataObject[field + '__colour'] !== 'undefined');

  return dataObjects.every(function (dataObject) {
    if (isSpellingColor) {

      return (firstDataObject[field + '__color'] === dataObject[field + '__color']);

    } else if (isSpellingColour) {

      return (firstDataObject[field + '__colour'] === dataObject[field + '__colour']);

    } else {
      return false;
    }
  });
}

function getDataObject__Id(dataObject) {
  var id = null;

  if (typeof dataObject.__id !== 'undefined') {
    id = dataObject.__id;
  } else if (typeof dataObject.id !== 'undefined') {
    id = dataObject.id;
  }

  return id;
}

function getDataObjectId(dataObject) {
  var id = null;

  if (typeof dataObject.id !== 'undefined') {
    id = dataObject.id;
  } else if (typeof dataObject.__id !== 'undefined') {
    id = dataObject.__id;
  }

  return id;
}

function getColor(colourDataByDataField, dataObject) {
  var color = '#cccccc';
  var spellingColor;
  var spellingColour;

  if (colourDataByDataField) {
    spellingColor = dataObject[colourDataByDataField + '__color'];
    spellingColour = dataObject[colourDataByDataField + '__colour'];

    if (typeof spellingColor !== 'undefined') {
      color = spellingColor;
    } else if (typeof spellingColour !== 'undefined') {
      color = spellingColour;
    } else {
      console.warn("Can't find " + colourDataByDataField + "__color or " + colourDataByDataField + "__colour for " + getDataObject__Id(dataObject) + ".");
    }
  }

  return color;
}

function sanitizeDataObjectKeys(dataObject) {
  var dataObjectKeys = Object.keys(dataObject);
  var sanitizedDataObject = {};

  dataObjectKeys.forEach(function sanitizeDataObjectKey(dataObjectKey) {
    dataObjectKey = dataObjectKey.toLowerCase();
    dataObjectKey = dataObjectKey.trim();

    sanitizedDataObject[dataObjectKey] = dataObject[dataObjectKey];
  });

  return sanitizedDataObject;
}

function sanitizeDataObjectLatitude(dataObject) {
  var parsedFloatNumber;

  if (dataObject.__latitude)  {
    parsedFloatNumber = parseFloat(dataObject.__latitude);

    if (isNaN(parsedFloatNumber)) {
      throw new Error("Can't parse __latitude to number.");
    } else {
      dataObject.__latitude = parsedFloatNumber;
    }
  }

  return dataObject;
}

function sanitizeDataObjectLongitude(dataObject) {
  var parsedFloatNumber;

  if (dataObject.__longitude)  {
    parsedFloatNumber = parseFloat(dataObject.__longitude);

    if (isNaN(parsedFloatNumber)) {
      throw new Error("Can't parse __longitude to number.");
    } else {
      dataObject.__longitude = parsedFloatNumber;
    }
  }

  return dataObject;
}

function sanitizeDataObject(dataObject) {
  dataObject = sanitizeDataObjectKeys(dataObject);
  dataObject = sanitizeDataObjectLatitude(dataObject);
  dataObject = sanitizeDataObjectLongitude(dataObject);

  return dataObject;
}

function sanitize(data) {
  var dataObjectIds = Object.keys(data);
  var sanitizedData = {};
  var dataObject;

  dataObjectIds.forEach(function (dataObjectId) {
    dataObject = data[dataObjectId];
    sanitizedData[dataObjectId] = sanitizeDataObject(dataObject);
  })

  return sanitizedData;
}

module.exports = {
  sanitize: sanitize,
  validateCsvIds: validateCsvIds,
  getColor: getColor,
  getDataObject__Id: getDataObject__Id,
  getDataObjectId: getDataObjectId,
  isMetaField: isMetaField,
  dataObjectsHaveSameColorValue: dataObjectsHaveSameColorValue,
  dataHasDateMetaFields: dataHasDateMetaFields,
  hasYearMetaField: hasYearMetaField,
  hasMonthMetaField: hasMonthMetaField,
  hasDayMetaField: hasDayMetaField,
  findWhichDataFieldsShouldFilterMapMarkers: findWhichDataFieldsShouldFilterMapMarkers,
  findWhichDataFieldsShouldFilterNodeLabels: findWhichDataFieldsShouldFilterNodeLabels,
  convertDataObjectsFieldNamesToLowerCase: convertDataObjectsFieldNamesToLowerCase,
  convertDataObjectFieldNamesToLowerCase: convertDataObjectFieldNamesToLowerCase,
  parseCsvToJson: parseCsvToJson,
  convertCsvToJson: convertCsvToJson,
  convertNewickToJson: convertNewickToJson,
  getLeafNamesInNewick: getLeafNamesInNewick,
  isValidCsvFormat: isValidCsvFormat,
  isValidNewickFormat: isValidNewickFormat,
  isDataObjectHasValidLatitude: isDataObjectHasValidLatitude,
  isDataObjectHasValidLongitude: isDataObjectHasValidLongitude,
  isAllDataObjectsHaveValidLatitudeAndLongitude: isAllDataObjectsHaveValidLatitudeAndLongitude,
  isCsvFieldNamesAndNewickLeafNamesMatch: isCsvFieldNamesAndNewickLeafNamesMatch,
  getCsvFieldNamesAndNewickLeafNamesThatDontMatch: getCsvFieldNamesAndNewickLeafNamesThatDontMatch,
  isCsvHasValidLatitudeAndLongitude: isCsvHasValidLatitudeAndLongitude,
  isCsvHasValidIds: isCsvHasValidIds,
  isDataFieldAMetaColumn: isDataFieldAMetaColumn,
  convertDataObjectToArray: convertDataObjectToArray
};
