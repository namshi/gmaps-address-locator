class gmapsAddressLocator {
	#defaultOptions = {
		locale: 'SA',
		mobileView: false,
		initialPosition: null,
		autocompleteFieldId: null,
		recenterBtnId: null,
		secondaryActionBtn: null,
		confirmBtn: null
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
			this.geoCodeLocation();
		}
	}
	initMap() {
		try {
			const defaultMapSettings = {
				zoom: 6,
				zoomControl: this.options.mobileView ? false : true,
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

			google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
				this.autocompleteInputField && this.autocompleteInputField.classList.remove('hidden');
				this.centerControlBtn && this.centerControlBtn.classList.remove('hidden');
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
			const options = {
				componentRestrictions: {
					country: this.options.locale
				}
			};
			this.autocompleteInputField = document.getElementById(this.options.autocompleteFieldId);
			this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.autocompleteInputField);
			const autocomplete = new google.maps.places.Autocomplete(this.autocompleteInputField, options);
			autocomplete.setFields(['name', 'formatted_address', 'geometry']);
			
			// Callback for search field value change
			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();
				this.map.setZoom(14);
				this.map.panTo(place.geometry.location);
				this.marker && this.marker.setPosition(place.geometry.location);
				if (this.infoWindow) {
					this.infoWindow.setContent(place.name);
					this.infoWindow.setPosition(place.geometry.location);
				}
			});
		} catch(e) {
			console.error(e);
		}
	}
	initRecenter(pos) {
		// Add recenter button to map
		try {
			this.centerControlBtn = document.getElementById(this.options.recenterBtnId);
			this.centerControlBtn.index = 1;
			this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.centerControlBtn);
			this.centerControlBtn.addEventListener('click', () => this.goToPoint(pos));
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
		geocoder.geocode({
			componentRestrictions: {
		    country: locale
		  }
		}, (results, status) => {
			if (status == google.maps.GeocoderStatus.OK) {
				this.map.setCenter(results[0].geometry.location);
			} else {
				console.error("Could not find location: " + locale);
			}
		});
	}
	geoCodeLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				// Add Recenter button
				if (this.options.recenterBtnId) {
					this.initRecenter(pos);
				}
				
				// Initial locating
				this.goToPoint(pos);
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
	goToPoint(pos) {
		const geocoder = new google.maps.Geocoder;

    geocoder.geocode({
      'location': pos
    }, (results, status) => {
      if (status === 'OK') {
      	let result = results[0];
        if (result) {
        	const locale = this.options.locale;
          const countryObj = result.address_components.find(x => x.types.indexOf('country') > -1);

          if (countryObj.short_name !== locale) {
            alert(`Location out of ${locale} country boundary`);
            return;
          }

          this.map.setZoom(14);
          this.map.panTo(pos);
          this.marker.setPosition(pos);
          this.infoWindow.setContent(result.formatted_address);
          this.infoWindow.setPosition(pos);
          this.infoWindow.open(this.map, this.marker);
          this.setSelectedLocation(result);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
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
}


export default gmapsAddressLocator;
