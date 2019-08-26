import gmapsAddressLocator from 'gmaps-address-locator';

let test = new gmapsAddressLocator('map', {
	locale: 'AE',
	confirmBtn: 'gmap-confirm-btn',
	secondaryActionBtn: 'gmap-add-manually-btn',
	recenterBtnId: 'gmap-recenter-btn',
	autocompleteFieldId: 'gmap-autocomplete-input'
});

test.onConfirm(res => console.log('Confirmed: ', res));
test.onSecondaryAction(() => console.log('clicked'));
