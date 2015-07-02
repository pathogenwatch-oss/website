var React = require('react');
var Router = require('react-router');
var FileDragAndDrop = require('react-file-drag-and-drop');
var ApiUtils = require('../../utils/Api');
var DataUtils = require('../../utils/Data');
var Loading = require('../Loading.react');
var ValidationError = require('../ValidationError.react');
var SetProjectMetadata = require('../SetProjectMetadata.react');
var HomePage = require('./HomePage.react');

var Home = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  raw: {
    csv: null,
    newick: null
  },

  project: {
    raw: {
      csv: null
    },
    data: null,
    tree: null,
    metadata: null,
    isListed: false
  },

  validationErrors: [],

  getInitialState: function () {
    return {
      isDataProvided: false,
      isTreeProvided: false,
      isMetadataProvided: false,
      isValidated: false,
      isValid: false,
      isUploading: false,
      isProjectListed: false
    };
  },

  componentDidUpdate: function () {
    if (this.state.isDataProvided
      && this.state.isTreeProvided
      && this.state.isMetadataProvided
      && this.state.isValidated
      && this.state.isValid
      && !this.state.isUploading) {

      this.setState({
        isUploading: true
      });

      ApiUtils.postProject(this.project, function (error, project) {
        if (error) {
          throw new Error('Failed to upload project files: ' + error);
        }

        var projectShortId = project['shortId'];

        this.context.router.transitionTo('/project/' + projectShortId);
      }.bind(this));

    }
  },

  validate: function () {
    var csv = this.raw.csv;
    var newick = this.raw.newick;
    var json = DataUtils.parseCsvToJson(csv);

    if (json.errors.length > 0) {
      this.validationErrors.push("CSV file is invalid.");

      var firstError = json.errors[0];

      this.validationErrors.push('Row ' + firstError.row + '. ' + firstError.message + '.');

      this.setState({
        isValidated: true,
        isValid: false
      });

      return;
    }

    var csvIdsValidationErrors = DataUtils.validateCsvIds(csv);

    if (csvIdsValidationErrors.length > 0) {

      this.validationErrors = csvIdsValidationErrors;

      this.setState({
        isValidated: true,
        isValid: false
      });

      return;
    }

    if (! DataUtils.isValidNewickFormat(newick)) {
      this.validationErrors.push("NEWICK file is invalid.");

      this.setState({
        isValidated: true,
        isValid: false
      });

      return;
    }

    if (! DataUtils.isCsvFieldNamesAndNewickLeafNamesMatch(csv, newick)) {
      this.validationErrors.push("CSV ids and NEWICK leaf names don't match.");

      var fieldsThatDontMatch = DataUtils.getCsvFieldNamesAndNewickLeafNamesThatDontMatch(csv, newick);

      if (fieldsThatDontMatch.fieldsThatAreMissingInCsv.length > 0) {
        fieldsThatDontMatch.fieldsThatAreMissingInCsv.forEach(function (fieldId) {
          this.validationErrors.push('CSV file is missing field with id ' + fieldId + '.');
        }.bind(this));
      }

      if (fieldsThatDontMatch.fieldsThatAreMissingInNewick.length > 0) {
        fieldsThatDontMatch.fieldsThatAreMissingInNewick.forEach(function (fieldId) {
          this.validationErrors.push('NWK file is missing field with id ' + fieldId + '.');
        }.bind(this));
      }

      this.validationErrors.push("Please update and try again.");

      this.setState({
        isValidated: true,
        isValid: false
      });

      return;
    }

    this.setState({
      isValidated: true,
      isValid: true
    });
  },

  readFile: function (file) {
    var project = this.project;
    var fileReader = new FileReader();

    fileReader.onload = function (event) {
      var fileContent = event.target.result;

      if (file.type === 'text/csv' || file.name.indexOf('.csv') !== -1) {

        this.raw.csv = fileContent;

        var json = DataUtils.convertCsvToJson(fileContent);
        json = DataUtils.convertDataObjectsFieldNamesToLowerCase(json);

        var dataObjects = {};
        var dataObjectId;

        json.forEach(function (dataObject) {
          dataObjectId = DataUtils.getDataObject__Id(dataObject);
          dataObjects[dataObjectId] = dataObject;
        });

        project.data = dataObjects;
        project.raw.csv = fileContent;

        this.setState({
          isDataProvided: true
        });

      } else if (file.name.indexOf('.nwk') !== -1) {

        this.raw.newick = fileContent;

        project.tree = fileContent;

        this.setState({
          isTreeProvided: true
        });
      } else {
        console.error('[Microreact] I can\'t recognise the type of ' + file.name + ' file that you\'ve dropped. Please only drop files with .csv or .nwk file extensions.');
      }

      if (this.raw.csv && this.raw.newick) {
        this.validate();
      }

    }.bind(this);

    fileReader.readAsText(file);
  },

  handleDrop: function (dataTransfer) {
    var files = dataTransfer.files;
    var fileCounter = 0;
    var file;

    for (; fileCounter < files.length; fileCounter++) {
      file = files[fileCounter];
      this.readFile(file);
    }
  },

  handleSetProjectMetadata: function (metadata) {
    this.project.metadata = metadata;
    this.setState({
      isMetadataProvided: true
    });
  },

  setIsProjectListed: function (isListed) {
    this.project.isListed = isListed;
    this.setState({
      isProjectListed: isListed
    });
  },

  render: function () {
    if (this.state.isValidated && !this.state.isValid) {

      var sectionStyle = {
        marginBottom: '10px'
      };

      var errorMessageElements = this.validationErrors.map(function (validationError) {
        return (
          <section key={validationError} style={sectionStyle}>
            {validationError}
          </section>
        );
      });

      return (
        <ValidationError>
          {errorMessageElements}
        </ValidationError>
      );
    }

    if (this.state.isValid && !this.state.isMetadataProvided) {
      return (
        <SetProjectMetadata
          handleSetProjectMetadata={this.handleSetProjectMetadata}
          isProjectListed={this.state.isProjectListed}
          setIsProjectListed={this.setIsProjectListed} />
      );
    }

    if (this.state.isUploading) {
      return (
        <Loading>
          Uploading files and creating your project...
        </Loading>
      );
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <HomePage
          isDataProvided={this.state.isDataProvided}
          isTreeProvided={this.state.isTreeProvided} />
      </FileDragAndDrop>
    );
  }
});

module.exports = Home;
