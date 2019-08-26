'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

var gmapsAddressLocator =
/*#__PURE__*/
function () {
  function gmapsAddressLocator() {
    var mapElId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var userMapSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, gmapsAddressLocator);

    _defaultOptions.set(this, {
      writable: true,
      value: {
        locale: 'SA',
        mobileView: false,
        initialPosition: null,
        autocompleteFieldId: null,
        recenterBtnId: null,
        secondaryActionBtn: null,
        confirmBtn: null
      }
    });

    if (!mapElId) {
      console.error("Please specify map element id");
      return false;
    }

    this.selectedLocation = null;
    this.mapElId = mapElId;
    this.options = Object.assign({}, _classPrivateFieldGet(this, _defaultOptions), options);
    this.userMapSettings = userMapSettings;
    this.initMap();
    this.initInfoWindow();
    this.initMarker();

    if (this.options.autocompleteFieldId) {
      this.initAutocomplete();
    }

    if (this.options.secondaryActionBtn) {
      this.addSecondaryActionBtn();
    }

    if (this.options.confirmBtn) {
      this.addConfirmBtn();
    }

    if (this.options.initialPosition) {
      this.goToPoint(this.options.initialPosition);
    } else {
      this.geoCodeLocation();
    }
  }

  _createClass(gmapsAddressLocator, [{
    key: "initMap",
    value: function initMap() {
      var _this = this;

      try {
        var defaultMapSettings = {
          zoom: 6,
          zoomControl: this.options.mobileView ? false : true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        };
        var settings = Object.assign({}, defaultMapSettings, this.userMapSettings);
        this.mapEl = document.getElementById(this.mapElId);
        this.map = new google.maps.Map(this.mapEl, settings);
        this.map.addListener('click', function (loc) {
          _this.goToPoint(loc.latLng);
        });
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
          _this.autocompleteInputField && _this.autocompleteInputField.classList.remove('hidden');
          _this.centerControlBtn && _this.centerControlBtn.classList.remove('hidden');
          _this.confirmBtn && _this.confirmBtn.classList.remove('hidden');
          _this.secondaryActionBtn && _this.secondaryActionBtn.classList.remove('hidden');
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "initMarker",
    value: function initMarker() {
      var _this2 = this;

      this.marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP
      });
      this.marker.addListener('dragstart', function () {
        _this2.infoWindow.close();
      });
      this.marker.addListener('dragend', function (loc) {
        _this2.goToPoint(loc.latLng);
      });
    }
  }, {
    key: "initInfoWindow",
    value: function initInfoWindow() {
      this.infoWindow = new google.maps.InfoWindow();
    }
  }, {
    key: "initAutocomplete",
    value: function initAutocomplete() {
      var _this3 = this;

      try {
        // Setup the autocomplete field and add it to map
        var options = {
          componentRestrictions: {
            country: this.options.locale
          }
        };
        this.autocompleteInputField = document.getElementById(this.options.autocompleteFieldId);
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.autocompleteInputField);
        var autocomplete = new google.maps.places.Autocomplete(this.autocompleteInputField, options);
        autocomplete.setFields(['name', 'formatted_address', 'geometry']); // Callback for search field value change

        autocomplete.addListener('place_changed', function () {
          var place = autocomplete.getPlace();

          _this3.map.setZoom(14);

          _this3.map.panTo(place.geometry.location);

          _this3.marker && _this3.marker.setPosition(place.geometry.location);

          if (_this3.infoWindow) {
            _this3.infoWindow.setContent(place.name);

            _this3.infoWindow.setPosition(place.geometry.location);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "initRecenter",
    value: function initRecenter(pos) {
      var _this4 = this;

      // Add recenter button to map
      try {
        this.centerControlBtn = document.getElementById(this.options.recenterBtnId);
        this.centerControlBtn.index = 1;
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.centerControlBtn);
        this.centerControlBtn.addEventListener('click', function () {
          return _this4.goToPoint(pos);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "addSecondaryActionBtn",
    value: function addSecondaryActionBtn() {
      this.secondaryActionBtn = document.getElementById(this.options.secondaryActionBtn);
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.secondaryActionBtn);
    }
  }, {
    key: "addConfirmBtn",
    value: function addConfirmBtn() {
      this.confirmBtn = document.getElementById(this.options.confirmBtn);
      this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.confirmBtn);
    }
  }, {
    key: "setInitialCenter",
    value: function setInitialCenter() {
      var _this5 = this;

      var geocoder = new google.maps.Geocoder();
      var locale = this.options.locale;
      geocoder.geocode({
        componentRestrictions: {
          country: locale
        }
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          _this5.map.setCenter(results[0].geometry.location);
        } else {
          console.error("Could not find location: " + locale);
        }
      });
    }
  }, {
    key: "geoCodeLocation",
    value: function geoCodeLocation() {
      var _this6 = this;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }; // Add Recenter button

          if (_this6.options.recenterBtnId) {
            _this6.initRecenter(pos);
          } // Initial locating


          _this6.goToPoint(pos);
        }, function () {
          // User denied access to location
          _this6.setInitialCenter();

          console.warn('User denied access to location');
        });
      } else {
        // Browser doesn't support Geolocation
        console.warn("Browser doesn't support geolocation");
      }
    }
  }, {
    key: "setSelectedLocation",
    value: function setSelectedLocation(location) {
      this.selectedLocation = location;
    }
  }, {
    key: "getSelectedLocation",
    value: function getSelectedLocation() {
      return this.selectedLocation;
    }
  }, {
    key: "goToPoint",
    value: function goToPoint(pos) {
      var _this7 = this;

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'location': pos
      }, function (results, status) {
        if (status === 'OK') {
          var result = results[0];

          if (result) {
            var locale = _this7.options.locale;
            var countryObj = result.address_components.find(function (x) {
              return x.types.indexOf('country') > -1;
            });

            if (countryObj.short_name !== locale) {
              alert("Location out of ".concat(locale, " country boundary"));
              return;
            }

            _this7.map.setZoom(14);

            _this7.map.panTo(pos);

            _this7.marker.setPosition(pos);

            _this7.infoWindow.setContent(result.formatted_address);

            _this7.infoWindow.setPosition(pos);

            _this7.infoWindow.open(_this7.map, _this7.marker);

            _this7.setSelectedLocation(result);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    }
  }, {
    key: "showMap",
    value: function showMap() {
      this.mapEl.style.display = 'block';
    }
  }, {
    key: "hideMap",
    value: function hideMap() {
      this.mapEl.style.display = 'none';
    }
  }, {
    key: "onConfirm",
    value: function onConfirm(fn) {
      var _this8 = this;

      if (!this.confirmBtn) return;
      this.confirmBtn.addEventListener('click', function (e) {
        fn(_this8.selectedLocation);
      });
    }
  }, {
    key: "onSecondaryAction",
    value: function onSecondaryAction(fn) {
      if (!this.secondaryActionBtn) return;
      this.secondaryActionBtn.addEventListener('click', function (e) {
        fn();
      });
    }
  }]);

  return gmapsAddressLocator;
}();

var _defaultOptions = new WeakMap();

module.exports = gmapsAddressLocator;
