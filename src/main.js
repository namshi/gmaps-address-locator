class gmapsAddressLocator {
	#defaultOptions = {
		locale: null,
		mobileView: false,
		initialPosition: null,
		autocompleteFieldId: null,
		locateMeBtnId: null,
		secondaryActionBtn: null,
		confirmBtn: null,
		mapPanZoomLevel: 14
	}
	constructor(mapElId = null, options = {}, userMapSettings = {}) {
		if (!mapElId) {
			console.error("Please specify map element id");
			return false;
		}

		this.selectedLocation = null;
		this.mapElId = mapElId;
		this.options = Object.assign({}, this.#defaultOptions, options);
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
			this.getNavigatorLocation();
		}
	}
	initMap() {
		try {
			const defaultMapSettings = {
				zoom: 6,
				zoomControl: this.options.mobileView ? false : true,
				gestureHandling: this.options.mobileView ? 'greedy' : 'cooperative',
				mapTypeControl: false,
				streetViewControl: false,
				fullscreenControl: false
			};

			const settings = Object.assign({}, defaultMapSettings, this.userMapSettings);
			this.mapEl = document.getElementById(this.mapElId);
			this.map = new google.maps.Map(this.mapEl, settings);

			this.map.addListener('click', loc => {
				this.goToPoint(loc.latLng);
			});

			this.map.addListener('zoom_changed', () => {
				this.options.mapPanZoomLevel = this.map.getZoom();
			});

			google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
				this.autocompleteInputField && this.autocompleteInputField.classList.remove('hidden');
				this.locateMeControlBtn && this.locateMeControlBtn.classList.remove('hidden');
				this.confirmBtn && this.confirmBtn.classList.remove('hidden');
				this.secondaryActionBtn && this.secondaryActionBtn.classList.remove('hidden');
			});
		} catch(e) {
			console.error(e);
		}
	}
	initMarker() {
		this.marker = new google.maps.Marker({
			map: this.map,
			draggable: true,
			animation: google.maps.Animation.DROP,
		});

		this.marker.addListener('dragstart', () => {
			this.infoWindow.close();
		});

		this.marker.addListener('dragend', loc => {
			this.goToPoint(loc.latLng);
		});
	}
	initInfoWindow() {
		this.infoWindow = new google.maps.InfoWindow;
	}
	initAutocomplete() {
		try {
			// Setup the autocomplete field and add it to map
			const options = {};

			if (this.options.locale) {
				options.componentRestrictions = {
					country: this.options.locale
				}
			}

			this.autocompleteInputField = document.getElementById(this.options.autocompleteFieldId);
			this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.autocompleteInputField);
			const autocomplete = new google.maps.places.Autocomplete(this.autocompleteInputField, options);
			autocomplete.setFields(['name', 'formatted_address', 'address_components', 'geometry']);
			
			// Callback for search field value change
			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();
				this.updateLocationOnMap(place);
			});
		} catch(e) {
			console.error(e);
		}
	}
	initLocateMe(pos) {
		// Add locate me button to map
		try {
			this.locateMeControlBtn = document.getElementById(this.options.locateMeBtnId);
			this.locateMeControlBtn.index = 1;
			this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.locateMeControlBtn);
			this.locateMeControlBtn.addEventListener('click', () => this.goToPoint(pos));
		} catch(e) {
			console.error(e);
		}
	}
	addSecondaryActionBtn() {
		this.secondaryActionBtn = document.getElementById(this.options.secondaryActionBtn);
		this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.secondaryActionBtn);
	}
	addConfirmBtn() {
		this.confirmBtn = document.getElementById(this.options.confirmBtn);
		this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.confirmBtn);
	}
	setInitialCenter() {
		const geocoder = new google.maps.Geocoder;
		const locale = this.options.locale;
		const options = {};
		if (locale) {
			options.componentRestrictions = {
				country: locale
			}
		}
		geocoder.geocode(options, (results, status) => {
			if (status == google.maps.GeocoderStatus.OK) {
				this.map.setCenter(results[0].geometry.location);
			} else {
				console.error("Could not find location: " + locale);
			}
		});
	}
	getNavigatorLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				
				// Initial locating
				this.goToPoint(pos, true);
			}, () => {
				// User denied access to location
				this.setInitialCenter();
				console.warn('User denied access to location');
			});
		} else {
			// Browser doesn't support Geolocation
			console.warn("Browser doesn't support geolocation");
		}
	}
	setSelectedLocation(location) {
		this.selectedLocation = location;
	}
	getSelectedLocation() {
		return this.selectedLocation;
	}
	goToPoint(pos, isInitial = false) {
		const geocoder = new google.maps.Geocoder;

    geocoder.geocode({
      'location': pos
    }, (results, status) => {
      if (status === 'OK') {
      	let result = results[0];
        if (result) {
        	const locale = this.options.locale;
        	if (locale) {
	          const countryObj = result.address_components.find(x => x.types.indexOf('country') > -1);

	          if (countryObj.short_name !== locale) {
	          	if (isInitial) {
	          		this.setInitialCenter();
	          	} else {
		            alert(`Location out of ${locale} country boundary`);
		            this.updateLocationOnMap(this.selectedLocation);
		          }
	            return;
	          }
	        }

        	// Add locate me button
					if (isInitial && this.options.locateMeBtnId) {
						this.initLocateMe(pos);
					}

          this.updateLocationOnMap(result);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
	}
	updateLocationOnMap(result) {
		const pos = result.geometry.location;
		const address = this.cleanAddress(result);
		
		result.lngLat =this.formatLngLat(result);
		result.formatted_address2 = address;
		result.city = this.getCityName(result);

		this.map.setZoom(this.options.mapPanZoomLevel);
    this.map.panTo(pos);
    this.marker&& this.marker.setPosition(pos);
    if (this.infoWindow) {
      this.infoWindow.setContent(address);
      this.infoWindow.setPosition(pos);
      this.infoWindow.open(this.map, this.marker);
    }

    this.setSelectedLocation(result);
    this.onLocationSelectionFn && this.onLocationSelectionFn(result);
	}
	cleanAddress(location) {
		let address = location.formatted_address;
		let name = location.name;
		let _address = address.split('-')[0];

		if (name && name.toLowerCase().trim() !== _address.toLowerCase().trim()) {
			_address = `${name}, ${_address}`
		}

		let sublocality = location.address_components.find(item => item.types.indexOf('sublocality_level_1') > -1);
		if (sublocality) {
			_address = `${_address}, ${sublocality.short_name}`;
		}
		
		return _address;
	}
	getCityName(location) {
		const foundCity = location.address_components.find(item => item.types.indexOf('administrative_area_level_1') > -1 );
		let result = '';
		if (foundCity) {
			result = foundCity.short_name || '';
		}
		return result;
	}
	formatLngLat(location) {
		const lngLat = {
			lng: location.geometry.location.lng().toFixed(6),
			lat: location.geometry.location.lat().toFixed(6),
		};

		return lngLat;
	}
	showMap() {
		this.mapEl.style.display = 'block';
	}
	hideMap() {
		this.mapEl.style.display = 'none';
	}
	onConfirm(fn) {
		if (!this.confirmBtn) return;
		this.confirmBtn.addEventListener('click', e => {
			fn(this.selectedLocation);
		});
	}
	onSecondaryAction(fn) {
		if (!this.secondaryActionBtn) return;
		this.secondaryActionBtn.addEventListener('click', e => {
			fn();
		});
	}
	onLocationSelection(fn) {
		this.onLocationSelectionFn = fn;
	}
}


export default gmapsAddressLocator;
