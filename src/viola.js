// Copyright (c) 2017 Jonathan Bredin
// MIT license http://opensource.org/licenses/MIT

// Example script to embed in html to transpose content down an octave and
// and insert alto clef, e.g. to render fiddle tunes from http://thesession.org
// for viola or mandola.
//
// Assumptions:
// - source abcjs_basic and abj-js-extras
// - source script with tuneAbc global variable
// - document has div id=sheetmusic
// - document can toggle useAltoClef and transposeDown global variables

var useAltoClef = true;
var transposeDown = true;
console.log('abc init', tuneAbc);

function render() {
	var abcToPrint = tuneAbc;
	if (useAltoClef) {
		abcToPrint = abcJsExtras.setClef(abcToPrint, 'alto');
	}
	if (transposeDown) {
		abcToPrint = abcJsExtras.tuneTranspose(abcToPrint, abcJsExtras.tokenDownOctave);
	}
	console.log('transformed', abcToPrint);
	ABCJS.renderAbc('sheetmusic', abcToPrint);
}

function toggleAltoClef() {
	useAltoClef = !useAltoClef;	
	render();
}

function toggleTransposeDown() {
	transposeDown = !transposeDown;
	render();
}

render();