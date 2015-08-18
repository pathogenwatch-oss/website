var React = require('react');

var Map = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    location: React.PropTypes.array.isRequired
  },


	componentDidMount(){

		// Only componentDidMount is called when the component is first added to
		// the page. This is why we are calling the following method manually.
		// This makes sure that our map initialization code is run the first time.

		this.componentDidUpdate();
	},

	componentDidUpdate(){

		if(this.lastLat == this.props.location[0].latitude && this.lastLng == this.props.location[0].longitude){
			// The map has already been initialized at this address.
			// Return from this method so that we don't reinitialize it
			// (and cause it to flicker).
			return;
		}

		this.lastLat = this.props.location[0].latitude;
		this.lastLng = this.props.location[0].longitude;

		var map = new GMaps({
			div: '#map',
			lat: this.props.location[0].latitude,
			lng: this.props.location[0].longitude,
			zoom: 4
		});

		// Adding a marker to the location we are showing
		map.addMarker({
			lat: this.props.location[0].latitude,
			lng: this.props.location[0].longitude
		});
	},

	render(){
		var mapStyle = {
			width: this.props.width,
			height: this.props.height
		}

		return (
			<div className="map-holder">
				<div id="map" style={mapStyle}></div>
			</div>
		);
	}

});

module.exports = Map;