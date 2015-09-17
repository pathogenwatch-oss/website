import Papa from 'papaparse';
import moment from 'moment';

function convertDataObjectFieldNamesToLowerCase(dataObject) {
  const fieldNames = Object.keys(dataObject);
  let fieldNamesCounter = 0;
  const dataObjectWithLowerCaseFieldNames = {};

  while (fieldNamesCounter < fieldNames.length) {
    const fieldName = fieldNames[fieldNamesCounter];
    dataObjectWithLowerCaseFieldNames[fieldName.toLowerCase()] = dataObject[fieldName];
    fieldNamesCounter = fieldNamesCounter + 1;
  }

  return dataObjectWithLowerCaseFieldNames;
}

function convertDataObjectsFieldNamesToLowerCase(dataObjects) {
  return dataObjects.map(convertDataObjectFieldNamesToLowerCase);
}

function parseCsvToJson(csv) {
  const results = Papa.parse(csv, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  if (results.errors.length > 0) {
    console.error('[Microreact] Errors during CSV to JSON conversion:');
    console.dir(results.errors);
  }

  results.data = convertDataObjectsFieldNamesToLowerCase(results.data);
  return results;
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

function findWhichDataFieldsShouldFilterMapMarkers(dataObjects) {
  const dataFieldsThatFilterMapMarkers = {};
  const dataObjectIds = Object.keys(dataObjects);
  const dataObject = dataObjects[dataObjectIds[0]];
  const dataObjectFields = Object.keys(dataObject);

  dataObjectFields.forEach(function (dataObjectField) {
    let cleanDataObjectFieldName;
    if (doesDataFieldHaveShape(dataObjectField)) {
      cleanDataObjectFieldName = dataObjectField.replace('__shape', '');
    } else if (doesDataFieldHaveColour(dataObjectField)) {
      cleanDataObjectFieldName = dataObjectField.replace('__colour', '').replace('__color', '');
    }
    dataFieldsThatFilterMapMarkers[cleanDataObjectFieldName] = true;
  });

  return Object.keys(dataFieldsThatFilterMapMarkers);
}

function convertDataObjectToArray(data) {
  const dataObjectIds = Object.keys(data);

  return dataObjectIds.map(function (dataObjectId) {
    return data[dataObjectId];
  });
}

function getDataObjectId(dataObject) {
  let id = null;

  if (typeof dataObject.__id !== 'undefined') {
    id = dataObject.__id;
  } else if (typeof dataObject.id !== 'undefined') {
    id = dataObject.id;
  }

  return id;
}

function getColor(colourDataByDataField, dataObject) {
  let color = '#cccccc';
  let spellingColor;
  let spellingColour;

  if (colourDataByDataField) {
    spellingColor = dataObject[colourDataByDataField + '__color'];
    spellingColour = dataObject[colourDataByDataField + '__colour'];

    if (typeof spellingColor !== 'undefined') {
      color = spellingColor;
    } else if (typeof spellingColour !== 'undefined') {
      color = spellingColour;
    } else {
      console.warn(`Can't find ${colourDataByDataField}__color or ${colourDataByDataField}__colour for ${getDataObjectId(dataObject)}.`);
    }
  }

  return color;
}

function getFormattedDateString({ year, month, day }) {
  if (year && !month && !day) {
    return year;
  }

  if (year && month && !day) {
    return moment(`${year}-${month}`, 'YYYY-MM').format('MMMM YYYY');
  }

  if (year && month && day) {
    return moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('Do MMMM YYYY');
  }

  return '';
}

export default {
  findWhichDataFieldsShouldFilterMapMarkers,
  getFormattedDateString,
  getDataObjectId,
  getColor,
  convertDataObjectToArray,
  parseCsvToJson,
};
