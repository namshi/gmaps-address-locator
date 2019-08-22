// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../dist/bundle.js":[function(require,module,exports) {
var gmapsAddressLocator = function () {
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

  var gmapsAddressLocator =
  /*#__PURE__*/
  function () {
    function gmapsAddressLocator() {
      var mapElId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var userMapSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, gmapsAddressLocator);

      if (!mapElId) {
        console.error("Please specify map element id");
        return false;
      }

      var defaultOptions = {
        locale: 'SA',
        mobileView: false,
        initialPosition: null,
        autocompleteFieldId: 'gmap-autocomplete-input',
        recenterBtnId: 'gmap-recenter-btn',
        secondaryActionBtn: null,
        confirmBtn: null
      };
      this.selectedLocation = null;
      this.mapElId = mapElId;
      this.options = Object.assign({}, defaultOptions, options);
      this.userMapSettings = userMapSettings;
      this.initMap();
      this.initInfoWindow();
      this.initMarker();
      this.initAutocomplete();

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
            _this.autocompleteInputField.classList.remove('hidden');

            _this.centerControlBtn.classList.remove('hidden');

            _this.confirmBtn && _this.confirmBtn.classList.remove('hidden');
            _this.secondaryActionBtn && _this.secondaryActionBtn.classList.remove('hidden');
          });
        } catch (e) {
          console.error(e);
        }
      }
    }, {
      key: "setInitialCenter",
      value: function setInitialCenter() {
        var _this2 = this;

        var geocoder = new google.maps.Geocoder();
        var locale = this.options.locale;
        geocoder.geocode({
          componentRestrictions: {
            country: locale
          }
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            _this2.map.setCenter(results[0].geometry.location);
          } else {
            console.error("Could not find location: " + locale);
          }
        });
      }
    }, {
      key: "initMarker",
      value: function initMarker() {
        var _this3 = this;

        this.marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          animation: google.maps.Animation.DROP
        });
        this.marker.addListener('dragstart', function () {
          _this3.infoWindow.close();
        });
        this.marker.addListener('dragend', function (loc) {
          _this3.goToPoint(loc.latLng);
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
        var _this4 = this; // Setup the autocomplete field and add it to map


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

          _this4.map.setZoom(14);

          _this4.map.panTo(place.geometry.location);

          _this4.marker && _this4.marker.setPosition(place.geometry.location);

          if (_this4.infoWindow) {
            _this4.infoWindow.setContent(place.name);

            _this4.infoWindow.setPosition(place.geometry.location);
          }
        });
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
      key: "initRecenter",
      value: function initRecenter() {
        var _this5 = this; // Add recenter button to map


        this.centerControlBtn = document.getElementById(this.options.recenterBtnId);
        this.centerControlBtn.index = 1;
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.centerControlBtn);
        this.centerControlBtn.addEventListener('click', function () {
          return _this5.goToPoint(pos);
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

            _this6.initRecenter(); // Initial locating


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
      value: function setSelectedLocation(pos) {
        var latLng = {};

        if (typeof pos.lat === "function") {
          latLng = {
            lat: pos.lat(),
            lng: pos.lng()
          };
        } else {
          latLng = {
            lat: pos.lat,
            lng: pos.lng
          };
        }

        this.selectedLocation = latLng;
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

              _this7.setSelectedLocation(pos);
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

  return gmapsAddressLocator;
}();
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _bundle = _interopRequireDefault(require("../dist/bundle.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_bundle.default);
return;
var test = new _bundle.default('map', {
  locale: 'AE',
  confirmBtn: 'gmap-confirm-btn',
  secondaryActionBtn: 'gmap-add-manually-btn'
});
test.onConfirm(function (res) {
  return console.log('Confirmed: ', res);
});
test.onSecondaryAction(function () {
  return console.log('clicked');
});
},{"../dist/bundle.js":"../dist/bundle.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44881" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map