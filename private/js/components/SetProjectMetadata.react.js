var React = require('react');

var SetProjectName = require('./SetProjectName.react');
var SetProjectDescription = require('./SetProjectDescription.react');
var SetProjectWebsite = require('./SetProjectWebsite.react');
var SetProjectEmail = require('./SetProjectEmail.react');
var NavigateToPreviousProjectMetadata = require('./NavigateToPreviousProjectMetadata.react');
var NavigateToNextProjectMetadata = require('./NavigateToNextProjectMetadata.react');
var ProjectSummary = require('./ProjectSummary.react');
var CreateProjectButton = require('./CreateProjectButton.react');
var FinishAddingProjectMetadataButton = require('./FinishAddingProjectMetadataButton.react');

var SetProjectMetadata = React.createClass({

  metadataFields: ['name', 'description', 'website', 'email'],
  requiredMetadataFields: ['name', 'description'],

  getInitialState: function () {
    return {
      step: 0,
      openSummary: false,
      metadata: {
        name: null,
        description: null,
        website: null,
        email: null
      }
    };
  },

  handleProjectMetadata: function (metadataName, metadataValue) {
    var currentMetadata = this.state.metadata;

    currentMetadata[metadataName] = metadataValue;

    this.setState({
      metadata: currentMetadata
    });
  },

  renderMetadataElement: function () {
    var step = this.state.step;
    var whatMetadataToRender = this.metadataFields[step];
    var metadataElement;

    if (whatMetadataToRender === 'name') {
      return <SetProjectName
        handleProjectMetadata={this.handleProjectMetadata}
        isRequired={true}
        value={this.state.metadata.name}
        handleNavigateToNextMetadata={this.incrementStep} />;
    }

    if (whatMetadataToRender === 'description') {
      return <SetProjectDescription
        handleProjectMetadata={this.handleProjectMetadata}
        isRequired={true}
        value={this.state.metadata.description}
        handleNavigateToNextMetadata={this.incrementStep} />;
    }

    if (whatMetadataToRender === 'website') {
      return <SetProjectWebsite
        handleProjectMetadata={this.handleProjectMetadata}
        value={this.state.metadata.website}
        handleNavigateToNextMetadata={this.incrementStep} />;
    }

    if (whatMetadataToRender === 'email') {
      return <SetProjectEmail
        handleProjectMetadata={this.handleProjectMetadata}
        value={this.state.metadata.email}
        handleNavigateToNextMetadata={this.handleNavigateToProjectSummary} />;
    }
  },

  isFirstStep: function () {
    var step = this.state.step;
    var numberOfSteps = this.metadataFields.length;

    return (step === 0);
  },

  isLastStep: function () {
    var step = this.state.step;
    var numberOfSteps = this.metadataFields.length;

    return (step === numberOfSteps - 1);
  },

  incrementStep: function () {
    this.setState({
      step: this.state.step + 1
    });
  },

  decrementStep: function () {
    this.setState({
      step: this.state.step - 1
    });
  },

  handleCreateProject: function () {
    this.props.handleSetProjectMetadata(this.state.metadata);
  },

  isAllRequiredMetadataProvided: function () {
    return (this.state.metadata.name && this.state.metadata.description);
  },

  isRenderNextStep: function () {
    var currentStep = this.state.step;
    var currentMetadataField = this.metadataFields[currentStep];
    var currentMetadataValue = this.state.metadata[currentMetadataField];
    var isCurrentMetadataFieldRequired = (this.requiredMetadataFields.indexOf(currentMetadataField) > -1);

    if (!this.isLastStep()) {
      if (isCurrentMetadataFieldRequired) {
        if (currentMetadataValue) {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  },

  getNextStepLabel: function () {
    var currentStep = this.state.step;
    var currentMetadataField = this.metadataFields[currentStep];
    var currentMetadataValue = this.state.metadata[currentMetadataField];
    var isCurrentMetadataFieldRequired = (this.requiredMetadataFields.indexOf(currentMetadataField) > -1);

    if (isCurrentMetadataFieldRequired) {
      return 'Next';
    } else {
      if (currentMetadataValue) {
        return 'Next';
      } else {
        return 'Skip';
      }
    }
  },

  handleNavigateToProjectSummary: function () {
    this.setState({
      openSummary: true
    });
  },

  renderMetadataNavigation: function () {
    return (
      <div className="row">
        <div className="col-xs-6 text-left">
          { ! this.isFirstStep() ? <NavigateToPreviousProjectMetadata handleNavigateToPrevious={this.decrementStep} /> : null }
        </div>
        <div className="col-xs-6 text-right">
          { this.isAllRequiredMetadataProvided() ? <FinishAddingProjectMetadataButton handleFinish={this.handleNavigateToProjectSummary} /> : null }
          { this.isRenderNextStep() ? <NavigateToNextProjectMetadata label={this.getNextStepLabel()} handleNavigateToNext={this.incrementStep} /> : null }
        </div>
      </div>
    );
  },

  handleCloseProjectSummary: function () {
    this.setState({
      openSummary: false
    });
  },

  renderStepCounter: function () {

    var currentStepStyle = {
      fontWeight: '600'
    };

    var totalNumberOfStepsStyle = {

    };

    var stepCounterContainerStyle = {
      margin: '40px',
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: '100'
    };

    return (
      <div style={stepCounterContainerStyle}>
        Step <span style={currentStepStyle}>{this.state.step + 1}</span> out of <span style={totalNumberOfStepsStyle}>{this.metadataFields.length}</span>:
      </div>
    );
  },

  render: function () {

    if (this.state.openSummary) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">

              <ProjectSummary
                metadata={this.state.metadata}
                handleCloseProjectSummary={this.handleCloseProjectSummary}
                handleCreateProject={this.handleCreateProject}
                isProjectListed={this.props.isProjectListed}
                setIsProjectListed={this.props.setIsProjectListed} />

            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            {this.renderStepCounter()}
            {this.renderMetadataElement()}
            {this.renderMetadataNavigation()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SetProjectMetadata;
