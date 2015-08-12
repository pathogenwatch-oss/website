var React = require('react');

var Showcase = React.createClass({
  render: function () {

    var containerStyle = {
      fontFamily: '"Lato", sans-serif',
      color: '#000',
      margin: 0,
      padding: '0 0 40px 0',
      overflow: 'hidden'
    };

    var h2Style = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '600',
      fontFamily: '"Lato", sans-serif',
      margin: '0'
    };

    var pStyle = {
      textAlign: 'left',
      fontSize: '18px',
      margin: '10px 0'
    };

    var caseStyle = {
      marginBottom: '40px'
    };

    var coverImageStyle = {
      width: '280px',
      margin: '30px 0'
    };

    var italicStyle = {
      fontStyle: 'italic'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">
              <div className="row">

                <div className="col-sm-6 text-left" style={caseStyle}>
                  <h2 style={h2Style}>
                    <a href="http://microreact.org/project/N1TRn11L"><span style={italicStyle}>Streptococcus pneumoniae</span> PMEN2</a>
                  </h2>
                  <a href="http://microreact.org/project/N1TRn11L">
                    <img src="/images/showcase/cover1.png" style={coverImageStyle} />
                  </a>
                  <p style={pStyle}>
                    Croucher NJ et al. 2014.<br />
                    Variable recombination dynamics during the emergence, transmission and 'disarming' of a multidrug-resistant pneumococcal clone. BMC Biology 12:49 <a href="http://www.ncbi.nlm.nih.gov/pubmed/24957517" target="_blank">www.ncbi.nlm.nih.gov/pubmed/24957517</a>
                  </p>
                </div>

                <div className="col-sm-6 text-left" style={caseStyle}>
                  <h2 style={h2Style}>
                    <a href="http://microreact.org/project/NJqiECX8"><span style={italicStyle}>Salmonella</span> Typhi</a>
                  </h2>
                  <a href="http://microreact.org/project/NJqiECX8">
                    <img src="/images/showcase/cover2.png" style={coverImageStyle} />
                  </a>
                  <p style={pStyle}>
                    Wong V et al. 2015.<br />
                    Phylogeographical analysis of the dominant multidrug-resistant H58 clade of <span style={italicStyle}>Salmonella</span> Typhi identifies inter- and intracontinental transmission events. Nature Genetics 47(6):632  <a href="http://www.ncbi.nlm.nih.gov/pubmed/25961941" target="_blank">www.ncbi.nlm.nih.gov/pubmed/25961941</a>
                  </p>
                </div>

              </div>
            </div>

            <div className="col-sm-10 col-sm-offset-1">
              <div className="row">

                <div className="col-sm-6 text-left" style={caseStyle}>
                  <h2 style={h2Style}>
                    <a href="http://microreact.org/project/NyqrhlsB">Y-chromosome Human Phylogeny</a>
                  </h2>
                  <a href="http://microreact.org/project/NyqrhlsB">
                    <img src="/images/showcase/cover3.png" style={coverImageStyle} />
                  </a>
                  <p style={pStyle}>
                    Hallast P et al. 2015.<br />
                    The Y-chromosome tree bursts into leaf: 13,000 high-confidence SNPs covering the majority of known clades. Mol Biol Evol 32(3):661 <a href="http://www.ncbi.nlm.nih.gov/pubmed/25468874" target="_blank">www.ncbi.nlm.nih.gov/pubmed/25468874</a>
                  </p>
                </div>

                <div className="col-sm-6 text-left" style={caseStyle}>
                  <h2 style={h2Style}>
                    <a href="http://microreact.org/project/EkKAhxoB"><span style={italicStyle}>Vibrio cholerae</span></a>
                  </h2>
                  <a href="http://microreact.org/project/EkKAhxoB">
                    <img src="/images/showcase/cover4.png" style={coverImageStyle} />
                  </a>
                  <p style={pStyle}>
                    Mutreja A et al. 2011.<br />
                    Evidence for several waves of global transmission in the seventh cholera pandemic. Nature 477:462 <a href="http://www.ncbi.nlm.nih.gov/pubmed/21866102" target="_blank">www.ncbi.nlm.nih.gov/pubmed/21866102</a>
                  </p>
                </div>

              </div>
            </div>

            <div className="col-sm-10 col-sm-offset-1">
              <div className="row">

                <div className="col-sm-6 text-left" style={caseStyle}>
                  <h2 style={h2Style}>
                    <a href="http://microreact.org/project/NJ-zAij8"><span style={italicStyle}>Staphylococcus aureus</span> ST239</a>
                  </h2>
                  <a href="http://microreact.org/project/NJ-zAij8">
                    <img src="/images/showcase/staphylococcus_aureus.png" style={coverImageStyle} />
                  </a>
                  <p style={pStyle}>
                    Harris S et al. 2010.<br />
                  Evolution of MRSA during hospital transmission and intercontinental spread. <a href="http://www.ncbi.nlm.nih.gov/pubmed/20093474" target="_blank">www.ncbi.nlm.nih.gov/pubmed/20093474</a>
                  </p>
                </div>

                <div className="col-sm-6 text-left" style={caseStyle}>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Showcase;
