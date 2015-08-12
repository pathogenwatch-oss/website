var React = require('react');
var PhyloCanvas = require('PhyloCanvas');

var ExplainNwkFormat = React.createClass({

  exampleNewickString: '(Bovine:0.69395,(Gibbon:0.36079,(Orangutan:0.33636,(Gorilla:0.17147,(Chimp:0.19268,Human:0.11927):0.08386):0.06124):0.15057):0.54939,Mouse:1.21460);',

  componentDidMount: function () {
    var phylocanvas = new PhyloCanvas.Tree('example-tree-container');
    phylocanvas.nodeAlign = true;
    phylocanvas.load(this.exampleNewickString);
    phylocanvas.setTreeType('rectangular');
    phylocanvas.setNodeSize(15);
    phylocanvas.setTextSize(30);
    phylocanvas.setZoom(phylocanvas.zoom - 1);
  },

  render: function () {

    var containerStyle = {
      fontFamily: '"Lato", sans-serif',
      color: '#000',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    };

    var h2Style = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '600',
      fontFamily: '"Lato", sans-serif',
      margin: '30px 0 30px 0'
    };

    var pStyle = {
      textAlign: 'left',
      fontSize: '20px',
      margin: '20px 0',
      fontWeight: '300'
    };

    var tableStyle = {
      fontSize: '20px',
      margin: '40px 0'
    };

    var exampleTableStyle = {
      fontSize: '16px',
      fontWeight: '300',
      margin: '40px 0'
    };

    var fieldNameStyle = {
      fontFamily: 'Inconsolata',
      fontSize: '24px',
      color: '#e74c3c',
      display: 'inline-block',
      margin: '0 10px'
    };

    var fieldDescriptionStyle = {
      fontWeight: '300',
      display: 'inline-block',
      padding: '2px 30px'
    };

    var inlineFieldNameStyle = {
      fontFamily: 'Inconsolata',
      color: '#e74c3c',
    };

    var downloadButtonStyle = {
      display: 'block',
      margin: '10px 10px 10px 0',
      fontSize: '20px'
    };

    var exampleTreeContainerStyle = {
      width: '100%'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">
              <h2 style={h2Style}>
                Newick format tree (nwk) file
              </h2>

              <p style={pStyle}>
                Newick notation is a way of representing bifurcating relationships between data as a tree with edge lengths using parentheses and commas.  Produced by Archie, Day, Felsenstein, Maddison, Meacham and Swofford many programs utilize Newick as an output format and further information can be found here:  <a href="http://en.wikipedia.org/wiki/Newick_format" target="_blank">en.wikipedia.org/wiki/Newick_format</a>
              </p>

              <h2 style={h2Style}>
                Example nwk string
              </h2>

              <p style={pStyle}>
                The following Newick string describes the phylogenetic relationships between a group of well known mammalian species:
              </p>

              <p style={pStyle}>
                <span style={inlineFieldNameStyle}>
                  {this.exampleNewickString}
                </span>
              </p>

              <p style={pStyle}>
                When visualised, it renders the following tree:
              </p>

              <div style={exampleTreeContainerStyle} id="example-tree-container"></div>

            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplainNwkFormat;
