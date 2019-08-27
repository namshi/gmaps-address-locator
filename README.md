# Gmaps Address Locator

> A small utility that allows easier integration with google maps to be mainly used to enable users to select their address on the map.

## ✨ Features

- Enables users to select location, location selections are represented with a marker and an information popup
- Autocomplete input search box
- User current location detection via navigator's geolocation api
- Options to add main and secondary call to action buttons with event listeners on the map
- Geofencing through locale (a check if selected point is within the selected locale region)
- API to retrieve currently selected locations and set callbacks on various events like dragend and confirm button click

## Install

```bash
npm i gmaps-address-locator
```

## Screenshot

![Gmap-address-locator](https://i.ibb.co/5kwgg0Z/gmaps-Address-Locator.png)

## Notes

- Make sure to load the google maps JS api in your app with the appropriate API Key, check google maps JS  documentation for more information. Gmaps address locator will not work if the google maps JS api is not loaded
- To enable autocomplete feature, add the places library when you're loading the google maps JS api
- To setup language, add the language param when loading the google maps JS api
- While using the navigator's geolocation api, users are prompted for access to location, if allowed, we pass and initiate the map with that location, if blocked, we show the map centered based on locale settings

## Usage

### Javascript Setup
```jsx
import gmapsAddressLocator from 'gmaps-address-locator';

// User defined configs
const config = {
	// When locale is set, it does the following:
	// Sets the autocomplete preferred region
	// Enables geofencing
	// On map load, centers the map on this locale
	locale: null,
	// A helper setting for usage on mobile devices, currently, it removes
	// zoom controls, WIP: pan map around a fixed marker for better UX
	mobileView: false,
	// Load the map on a specific position, should be an object in the following format:
	// { lng: LONGITUDE, lat: LATITUDE }
	initialPosition: null,
	// Enables autocomplete, enter the autocomplete html input field id
	// Hint: preferably, add a .hidden class to the input field to prevent flicker
	// effect from page load to map load
	autocompleteFieldId: null,
	// Adds locate me button to map, enter button id
	locateMeBtnId: null,
	// Adds a main CTA button at the bottom center of the map, event listener can
	// be added through myMap.onConfirm button (described below)
	confirmBtn: null
	// Adds a secondary CTA button at the top center of the map (to the right of the autocomplete field if enabled)
	// event listener can be added through myMap.onSecondaryAction (described below)
	secondaryActionBtn: null,
}

// Google maps native settings, check google maps JS api documentation for more info
// Example:
const mapSettings = {
	zoom: 4,
	center: myLatLng,
	mapTypeId: 'satellite',
	etc..
}

// @param1: map id
// @param2: user defined configs
// @param3: google maps settings
const myMap = new gmapsAddressLocator('map', config, mapSettings);

// Call back function for the click event of the confirm button
// Passes the currently selected location result as parameter
myMap.onConfirm(res => console.log('Confirm button clicked: ', res));

// Call back function for the click event of the secondary button
myMap.onSecondaryAction(() => console.log('do something'));

// Call back function for any location selection/update event,
// event could be fired on a drag end event or an autocomplete option selection.
// Passes the currently selected location result as parameter
myMap.onLocationSelection(res => console.log(res));

// Other helper functions:
// Shows map
myMap.showMap();

// Hides map
myMap.hideMap();
```

### HTML
```html
<!DOCTYPE html>
<html>
<head>
	<title>Gmaps address locator - example</title>
</head>
<body>
	<!-- Main map container, make sure this is 100% height -->
	<div id="map" class="map" style="height: 100%"></div>
	
	<!-- Autocomplete search input field -->
	<input id="gmap-autocomplete-input" class="pac-input controls hidden" type="text" placeholder="Search addresses" />
	
	<!-- Confirm button -->
	<button id="gmap-confirm-btn" class="hidden">Confirm location</button>
	
	<!-- Secondary action button -->
	<button id="gmap-add-manually-btn" class="hidden">Add manually</button>
	
	<!-- Locate me button -->
	<div id="gmap-locate-me-btn" class="hidden">Locate me</div>


	<!-- Make sure to update this script with your api key -->
	<script src="https://maps.googleapis.com/maps/api/js?key=ENTER_YOUR_API_KEY_HERE&libraries=places"></script>
</body>
</html>
```

### CSS
For CSS, feel free to style those buttons as you like!

## Selected location object output

When retrieving the selected location object, we return the result of the google maps geolocation or autocomplete search query, plus a couple of custom fields with a bit more data, sample output:

```jsx
{
	// Native google maps fields
  "address_components",
  "formatted_address",
  "geometry"
  "place_id",
  "plus_code",
  "types",
  // Custom fields
  "lngLat",
  "formatted_address2",
  "city"
}
```
