// Copyright (c) 2017 Jonathan Bredin
// MIT license http://opensource.org/licenses/MIT

const abcJsExtras = require('../src/abc-js-extras.js');

describe('ABC Extras', function() {	
	it('it can add alto clef', function() {
			const tune = `X:1
				T: Simple Song
				M:4/4
				L:1/4
				K:A
				F/2G/2|:"A"AA/2B/2 AA/2B/2|"A"c/2B/2A "D"FE/2F/2|"A"A3:|`;
			const withAlto = abcJsExtras.setClef(tune, 'alto');			
			const titlePos = withAlto.indexOf('X:1');
			const clefPos = withAlto.indexOf('clef=alto');
			const keyPos = withAlto.indexOf('K:A');

			expect(titlePos).toBeGreaterThan(-1);
			expect(titlePos).toBeLessThan(clefPos);
			expect(clefPos).toBeLessThan(keyPos);
	});
	
	it('it can add change treble to alto clef', function() {
			const tune = `X:1
				T: Simple Song
				M:4/4
				L:1/4
				V: 1 clef=treble
				K:A
				F/2G/2|:"A"AA/2B/2 AA/2B/2|"A"c/2B/2A "D"FE/2F/2|"A"A3:|`;
			const withAlto = abcJsExtras.setClef(tune, 'alto');			
			const titlePos = withAlto.indexOf('X:1');
			const clefPos = withAlto.indexOf('clef=alto');
			const keyPos = withAlto.indexOf('K:A');
			
			expect(titlePos).toBeGreaterThan(-1);
			expect(titlePos).toBeLessThan(clefPos);
			expect(clefPos).toBeLessThan(keyPos);
	});
		
	it('it can partition a tune into header and notes', function() {
		const header = `X:1
				T: Simple Song
				M:4/4
				L:1/4
				V: 1 clef=treble
				K:A`;
		const notes = `F/2G/2|:"A"AA/2B/2 AB:|
|:"A"c/2B/2A "D"FE/2F/2|"A"A A A:|`;
		const tune = header + '\n' + notes;
		
		expect(abcJsExtras._getHeader(tune)).toBe(header.replace(/\t*/g, ''));
		expect(abcJsExtras._getNotes(tune)).toBe(notes);
	});
		
	it('it can transpose tokens down an octave', function() {
			function note(v) {
				return { 'type': 'alpha', 'token': v };
			}
			expect(abcJsExtras.tokenDownOctave(note('c\''))).toEqual(note('c'));
			expect(abcJsExtras.tokenDownOctave(note('a'))).toEqual(note('A'));
			expect(abcJsExtras.tokenDownOctave(note('G'))).toEqual(note('G,'));
			expect(abcJsExtras.tokenDownOctave(note('D,'))).toEqual(note('D,,'));
			
			expect(abcJsExtras.tokenDownOctave(note('ff'))).toEqual(note('FF'));
	});
	
	it('it can transpose tokens up an octave', function() {
			function note(v) {
				return { 'type': 'alpha', 'token': v };
			}
			expect(abcJsExtras.tokenUpOctave(note('c\''))).toEqual(note('c\'\''));
			expect(abcJsExtras.tokenUpOctave(note('B'))).toEqual(note('b'));
			expect(abcJsExtras.tokenUpOctave(note('e'))).toEqual(note('e\''));
			expect(abcJsExtras.tokenUpOctave(note('a\''))).toEqual(note('a\'\''));
			
			expect(abcJsExtras.tokenUpOctave(note('GG'))).toEqual(note('gg'));
	});

	it('it passes through non-alpha abc-js tokens', function() {
			const token = { 'type': 'punct' };
			expect(abcJsExtras.tokenDownOctave(token)).toBe(token);
			expect(abcJsExtras.tokenUpOctave(token)).toBe(token);
	});
	
	it('it passes through rest abc-js tokens', function() {
			const token = { 'type': 'alpha', 'token': 'z' };
			expect(abcJsExtras.tokenDownOctave(token)).toEqual(token);
			expect(abcJsExtras.tokenUpOctave(token)).toEqual(token);
	});

	it('it can transpose a tune down an octave', function() {
		// ABCJS currently twiddles the document on import, breaking unit tests.
		// Stub out a simple tokenizer here.
		function tokenizer(str, start, end) {
			const substr = str.substring(start, end).split('');
			const result = [];
			var quotedToken = null;
			for (var i = start; i < end; i++) {
				if (substr[i] == '"') {
					if (quotedToken == null) {
						quotedToken = '';
					} else {
						result.push({token: quotedToken, type: 'quote'});
						quotedToken = null;
					}
				} else if (quotedToken != null) {
					quotedToken += substr[i];
				} else if (substr[i].match(/[0-9]/)) {
					result.push({token: substr[i], type: 'number'});
				} else if (substr[i] == '|') {
					result.push({token: substr[i], type: 'punct'});
				} else {
					result.push({token: substr[i], type: 'alpha'}); // doesn't group
				}
			}
			
			return result;
		}
			
		const tune = `X:1
T: Simple Song
M:4/4
L:1/4
K:A
"A"AA "D"DD|
"G7"GG "A7"A2|`;

		const transposed = abcJsExtras.tuneTranspose(
			tune, abcJsExtras.tokenDownOctave, tokenizer);
		expect(transposed).toBe(
`X:1
T: Simple Song
M:4/4
L:1/4
K:A
"A"A,A, "D"D,D,|
"G7"G,G, "A7"A,2|`);
	});
});
