// Copyright (c) 2017 Jonathan Bredin
// MIT license http://opensource.org/licenses/MIT

/**
* Simple utilities to manipulate abc music notation ahead of abc-js for 
* rendering.
*/
const abcJsExtras = (function() {
	const KEY_LINE_PATTERN = /^\s*K:/;
	
	/** 
	* Extract the header from an ABC tune string, matching lines up to 
	* and including key specification.  Gracefully assume presence of X and T
	* fields.
	* http://abcnotation.com/wiki/abc:standard:v2.1#tune_header_definition
	*/
	function getHeader(abcStr) {
		const lines = abcStr.split(/[\r\n]+/).map(line => line.trim());
		const keyIdx = lines.findIndex(line => line.match(KEY_LINE_PATTERN));
		if (keyIdx < 0) {
			return '';
		}	else {
			return lines.splice(0, keyIdx + 1).join('\n').trim();
		}
	}
	
	/** Extract the notes from an ABC tune string, by removing the header. */
	function getNotes(abcStr) {
		const lines = abcStr.split(/[\r\n]+/).map(line => line.trim());
		const keyIdx = lines.findIndex(line => line.match(KEY_LINE_PATTERN));
		return lines.splice(keyIdx + 1, lines.length).join('\n').trim();
	}
	
	/** Transpose down an octave an abc note string. */
	function noteDownOctave(note) {
		if (note.endsWith("'")) {
			return note.substring(0, note.length - 1);
		} else if (note.match(/[a-g]/)) {
			return note.toUpperCase();
		} else if (note.match(/[A-G]/)) {
			// also note.endsWith(',')
			return note + ',';	
		} else {
			return note;	
		}
	}
	
	/** Transpose down an octave an abc note string. */
	function noteUpOctave(note) {
		if (note.endsWith(",")) {
			return note.substring(0, note.length - 1);
		} else if (note.match(/[A-G]/)) {
			return note.toLowerCase();
		} else if (note.match(/[a-g]/)) {
			// also note.endsWith('\'')
			return note + '\'';	
		} else {
			return note;	
		}
	}
	
	/** Internal function to apply to abcjs token alpha content. */
	function tokenTransform(token, f) {
		var noteRE = /[a-gA-G][0-9]?[',]*/;
		if (token.type === 'alpha') {
			var toProcess = token.token;
			var note = '';
			while (toProcess) {
				var next = toProcess.match(noteRE);
				if (next) {
					note += f(next[0]);
					toProcess = toProcess.substring(next[0].length);
				} else {
					note += toProcess;
					toProcess = null;	
				}
			}
			return Object.assign({}, token, {token: note});
		} else {
			return token;	
		}
	}
	
	/** Transpose down an octave an abcjs token. */
	function tokenDownOctave(token) {
		return tokenTransform(token, noteDownOctave);
	}
	
	/** Transpose up an octave an abcjs token. */
	function tokenUpOctave(token) {
		return tokenTransform(token, noteUpOctave);
	}
	
	/** Take a abcjs token to a string to be printed in ABC. */
	function printToken(token) {
		if (token.type === 'quote') {
			return `"${token.token}"`;
		} else {
			return token.token;
		}
	}
		
	/** 
	* Change/add clef to a single-voice abc tune.
	* Must follow X: but precede K:.  Parameterize clef, for customization later.
	* @param {string} clef e.g. 'alto' or 'bass'
	*/ 
	function setClef(abcStr, clef) {
		const clefStr = 'clef=' + clef;
		const result = abcStr.replace(/clef[ ]*=[ ]*[a-z]*/, clefStr);
		if (result.match(/clef\s*=\s*alto/)) {
			return result;
		} else { // voice/clef cannot precede title....
			return result.replace(/(K:[^\n]*\n)/, `V:1 ${clefStr}\n$1`);
		}
	}
	
	/**
	* Transpose an abc tune string. 
	* @param {function|null} tokenizerOpt a function to tokenize note string
	*   for unit tests or null to use the ABCJS parser.
	*/
	function tuneTranspose(abcStr, transposeF, tokenizerOpt) {
		const header = getHeader(abcStr);
		const notes = getNotes(abcStr);
		
		var tokenizer;
		if (tokenizerOpt) {
			tokenizer = tokenizerOpt;
		} else {
			// ? tokenizer getMeat() undefined if we just 
			// tokenizer = new ABCJS.parse.tokenizer().tokenize
			const t = new ABCJS.parse.tokenizer();
			tokenizer = (group, start, end) => 
				t.tokenize(group, start, end);
		}
		
		const transposed = notes.split(/[\n\r]+/).map(
			line => line.split(/\s+/).
			map(group => tokenizer(group, 0, group.length)).
			map(tokenGroup => 
				tokenGroup.map(transposeF).
				map(printToken).join('')).
			join(' ')).
		join('\n');
		
		return header + '\n' + transposed;
	}
	
	return {
		setClef: setClef,
		tokenDownOctave: tokenDownOctave,
		tokenUpOctave: tokenUpOctave,
		tuneTranspose: tuneTranspose,
		_getHeader: getHeader,
		_getNotes: getNotes,
	};
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = abcJsExtras;
}