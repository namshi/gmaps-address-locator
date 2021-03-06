import gmapsAddressLocator from '../dist/cjs/gmaps-address-locator';

let test = new gmapsAddressLocator('map', {
	locale: 'AE',
	confirmBtn: 'gmap-confirm-btn',
	secondaryActionBtn: 'gmap-add-manually-btn',
	locateMeBtnId: 'gmap-locate-me-btn',
	autocompleteFieldId: 'gmap-autocomplete-input'
});

test.onReady(() => console.log('ready'));
test.onConfirm(res => console.log('Confirmed: ', res));
test.onSecondaryAction(() => console.log('clicked'));
test.onLocationSelection(res => console.log(res));
test.onFail(e => console.log(e));
