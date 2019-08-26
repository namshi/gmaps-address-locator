'use strict';function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _classPrivateFieldGet(a,b){var c=b.get(a);if(!c)throw new TypeError("attempted to get private field on non-instance");return c.get?c.get.call(a):c.value}var gmapsAddressLocator=/*#__PURE__*/function(){function a(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},d=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};return _classCallCheck(this,a),_defaultOptions.set(this,{writable:!0,value:{locale:"SA",mobileView:!1,initialPosition:null,autocompleteFieldId:null,recenterBtnId:null,secondaryActionBtn:null,confirmBtn:null}}),b?void(this.selectedLocation=null,this.mapElId=b,this.options=Object.assign({},_classPrivateFieldGet(this,_defaultOptions),c),this.userMapSettings=d,this.initMap(),this.initInfoWindow(),this.initMarker(),this.options.autocompleteFieldId&&this.initAutocomplete(),this.options.secondaryActionBtn&&this.addSecondaryActionBtn(),this.options.confirmBtn&&this.addConfirmBtn(),this.options.initialPosition?this.goToPoint(this.options.initialPosition):this.getNavigatorLocation()):(console.error("Please specify map element id"),!1)}return _createClass(a,[{key:"initMap",value:function(){var a=this;try{var b={zoom:6,zoomControl:!this.options.mobileView,mapTypeControl:!1,streetViewControl:!1,fullscreenControl:!1},c=Object.assign({},b,this.userMapSettings);this.mapEl=document.getElementById(this.mapElId),this.map=new google.maps.Map(this.mapEl,c),this.map.addListener("click",function(b){a.goToPoint(b.latLng)}),google.maps.event.addListenerOnce(this.map,"tilesloaded",function(){a.autocompleteInputField&&a.autocompleteInputField.classList.remove("hidden"),a.centerControlBtn&&a.centerControlBtn.classList.remove("hidden"),a.confirmBtn&&a.confirmBtn.classList.remove("hidden"),a.secondaryActionBtn&&a.secondaryActionBtn.classList.remove("hidden")})}catch(a){console.error(a)}}},{key:"initMarker",value:function(){var a=this;this.marker=new google.maps.Marker({map:this.map,draggable:!0,animation:google.maps.Animation.DROP}),this.marker.addListener("dragstart",function(){a.infoWindow.close()}),this.marker.addListener("dragend",function(b){a.goToPoint(b.latLng)})}},{key:"initInfoWindow",value:function(){this.infoWindow=new google.maps.InfoWindow}},{key:"initAutocomplete",value:function(){var a=this;try{// Setup the autocomplete field and add it to map
var b={componentRestrictions:{country:this.options.locale}};this.autocompleteInputField=document.getElementById(this.options.autocompleteFieldId),this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.autocompleteInputField);var c=new google.maps.places.Autocomplete(this.autocompleteInputField,b);c.setFields(["name","formatted_address","address_components","geometry"]),c.addListener("place_changed",function(){var b=c.getPlace();a.updateLocationOnMap(b.geometry.location,b.name),a.setSelectedLocation(b)})}catch(a){console.error(a)}}},{key:"initRecenter",value:function(a){var b=this;// Add recenter button to map
try{this.centerControlBtn=document.getElementById(this.options.recenterBtnId),this.centerControlBtn.index=1,this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.centerControlBtn),this.centerControlBtn.addEventListener("click",function(){return b.goToPoint(a)})}catch(a){console.error(a)}}},{key:"addSecondaryActionBtn",value:function(){this.secondaryActionBtn=document.getElementById(this.options.secondaryActionBtn),this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.secondaryActionBtn)}},{key:"addConfirmBtn",value:function(){this.confirmBtn=document.getElementById(this.options.confirmBtn),this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.confirmBtn)}},{key:"setInitialCenter",value:function(){var a=this,b=new google.maps.Geocoder,c=this.options.locale;b.geocode({componentRestrictions:{country:c}},function(b,d){d==google.maps.GeocoderStatus.OK?a.map.setCenter(b[0].geometry.location):console.error("Could not find location: "+c)})}},{key:"getNavigatorLocation",value:function(){var a=this;navigator.geolocation?navigator.geolocation.getCurrentPosition(function(b){var c={lat:b.coords.latitude,lng:b.coords.longitude};// Add Recenter button
a.options.recenterBtnId&&a.initRecenter(c),a.goToPoint(c)},function(){a.setInitialCenter(),console.warn("User denied access to location")}):console.warn("Browser doesn't support geolocation")}},{key:"setSelectedLocation",value:function(a){this.selectedLocation=a}},{key:"getSelectedLocation",value:function(){return this.selectedLocation}},{key:"goToPoint",value:function(a){var b=this,c=new google.maps.Geocoder;c.geocode({location:a},function(c,d){if("OK"===d){var e=c[0];if(e){var f=b.options.locale,g=e.address_components.find(function(a){return-1<a.types.indexOf("country")});if(g.short_name!==f)return void alert("Location out of ".concat(f," country boundary"));b.updateLocationOnMap(a,b.cleanAddress(e.formatted_address)),b.setSelectedLocation(e)}else console.log("No results found")}else console.log("Geocoder failed due to: "+d)})}},{key:"updateLocationOnMap",value:function(a,b){this.map.setZoom(14),this.map.panTo(a),this.marker&&this.marker.setPosition(a),this.infoWindow&&(this.infoWindow.setContent(b),this.infoWindow.setPosition(a),this.infoWindow.open(this.map,this.marker))}},{key:"cleanAddress",value:function(a){return a.split("-")[0]}},{key:"showMap",value:function(){this.mapEl.style.display="block"}},{key:"hideMap",value:function(){this.mapEl.style.display="none"}},{key:"onConfirm",value:function(a){var b=this;this.confirmBtn&&this.confirmBtn.addEventListener("click",function(){a(b.selectedLocation)})}},{key:"onSecondaryAction",value:function(a){this.secondaryActionBtn&&this.secondaryActionBtn.addEventListener("click",function(){a()})}}]),a}(),_defaultOptions=new WeakMap;module.exports=gmapsAddressLocator;
