L.FeatureGroup.LassoSelect = L.FeatureGroup.extend({

  options: {
    activeTooltip: 'Click and release to place your first point.',
    startedTooltip: 'Click on the map to draw an edge.',
    readyTooltip: 'Continue placing points or click on the first point to finish shape.',
    finishedTooltip: '',
    polyline: {},
    initialPath: null,
  },

  initialize(options) {
    L.Util.setOptions(this, options);
  },

  onAdd(map) {
    this.map = map;
    this.disable();

    if (this.options.control) {
      this.control = L.control.lassoSelect(this, this.options.control);
      this.control.addTo(map);
    }

    if (this.options.initialPath) {
      for (var i = 0; i < this.options.initialPath.length; i++) {
        this.addPointToPath(this.options.initialPath[i]);
      }
    }
    if (!this.options.noClickEvent) {
      this.map.on('click', this.onClick, this);
    }
  },

  onRemove() {
    this.map = null;
    this.off('click');
  },

  enable() {
    this.isActive = true;
    this.reset();
    this.bringToFront();
  },

  disable() {
    this.isActive = false;
    this.reset();
  },

  toggle() {
    if (this.isActive) this.disable();
    else this.enable();
  },

  reset() {
    // remove the polygon from the map and clear its reference
    if (this.polygon) {
      this.map.removeLayer(this.polygon);
    }
    this.polygon = null;

    // remove the polyline from the map and clear its reference
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }
    this.polyline = null;

    // remove point markers
    if (this.markers) {
      for (var i = 0; i < this.markers.length; i++) {
        this.map.removeLayer(this.markers[i]);
      }
    }
    this.markers = [];

    // reset state
    this.isStarted = false;
    this.isFinished = false;

    // reset default tooltip
    this.setMapTooltip();
  },

  getPath() {
    if (this.isStarted) {
      return this.polyline.getLatLngs();
    }
    return null;
  },

  getBounds() {
    if (this.isFinished) {
      return this.polyline.getBounds();
    }
    return null;
  },

  contains(point) {
    var path = this.getPath();

    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var x = point.lat, y = point.lng;
    var inside = false;
    for (var i = 0, j = path.length - 1; i < path.length; j = i++) {
      var xi = path[i].lat, yi = path[i].lng;
      var xj = path[j].lat, yj = path[j].lng;
      var intersect = ((yi > y) != (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  },

  setMapTooltip() {
    var tooltip = '';
    var cursor = '';
    if (this.isActive) {
      if (this.isFinished) {
        tooltip = this.options.finishedTooltip;
      } else if (!this.isStarted) {
        cursor = 'crosshair';
        tooltip = this.options.activeTooltip;
      } else if (this.getPath().length < 3) {
        cursor = 'crosshair';
        tooltip = this.options.startedTooltip;
      } else {
        cursor = 'crosshair';
        tooltip = this.options.readyTooltip;
      }
    }
    this.map._container.style.cursor = cursor;
    this.map._container.title = tooltip;
    // if (tooltip) {
    //   this.bindPopup(tooltip);
    //   this.openPopup(this.map.getCenter());
    // }
  },

  onClick(event) {
    if (this.isActive) {
      if (this.isFinished && this.controlled !== false) {
        // this.reset();
        // this.fire('click', event);
      } else {
        this.addPointToPath(event.latlng);
        this.setMapTooltip();
      }
    }
  },

  addPointToPath(latlng) {
    if (!this.isStarted) {
      this.polyline = L.polyline([], this.options.polyline).addTo(this.map);
      this.markers = [];
      this.isStarted = true;
    }

    this.polyline.addLatLng(latlng);

    const marker = L.marker(latlng, {
      draggable: true,
      icon: L.divIcon({ html: '' }),
    }).addTo(this.map);

    if (this.markers.length === 0) {
      marker.on('click', this.completePath.bind(this));
    }

    marker.on('dragend', this.fire.bind(this, 'pathchange'));

    marker.on('drag', this.updatePath.bind(this));

    this.markers.push(marker);
  },

  updatePath() {
    // create a new path by joining the positions of markers
    var path = [];
    for (var i = 0; i < this.markers.length; i++) {
      path.push(this.markers[i].getLatLng());
    }

    // complete the path by adding the first position
    path.push(this.markers[0].getLatLng());

    // update polyline path
    this.polyline.setLatLngs(path);
  },

  completePath() {
    // do nothing if the path has been completed
    if (this.isFinished) return;

    // can only complete the path after 3 points have been selected
    if (this.markers.length < 3) return;

    // complete the path by adding the fisrt point, then mark it as finished
    this.polyline.addLatLng(this.markers[0].getLatLng());
    this.isFinished = true;

    // update map tooltip
    this.setMapTooltip();

    // trigger path change event
    this.fire('pathchange');
  },

});

L.featureGroup.lassoSelect = function (options) {
  return new L.FeatureGroup.LassoSelect(options);
};

L.Control.LassoSelect = L.Control.extend({

  options: {
    content: 'Lasso',
    className: 'leaflet-lasso-select-control',
  },

  initialize(lasso, options) {
    this.lasso = lasso;
    L.Util.setOptions(this, options);
  },

  onAdd(map) {
    this.map = map;

    var button = L.DomUtil.create('button');
    button.innerHTML = this.options.content;
    button.className = this.options.className;

    this._onClick = this.onClick.bind(this);
    button.addEventListener('click', this._onClick);

    this.button = button;
    return button;
  },

  onRemove() {
    this.map = null;
    button.removeEventListener('click', this._onClick);
  },

  onClick(event) {
    event.stopPropagation();
    this.lasso.toggle();
    this.button.classList.toggle('active');
  },

});

L.control.lassoSelect = function (lasso, options) {
  return new L.Control.LassoSelect(lasso, options);
};
