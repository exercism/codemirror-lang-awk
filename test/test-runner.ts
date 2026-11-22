import { EditorState } from '@codemirror/state';
import { StringStream } from '@codemirror/language';
import {
  awkLanguage,
  awkLinter,
  awkStreamParser,
  GAWK_BUILTIN_FUNCTIONS,
  GAWK_DIRECTIVES,
  GAWK_KEYWORDS
} from '../src/index';

console.log('--- Testing GNU AWK CodeMirror 6 Plugin ---');

let failures = 0;

// Like console.assert, but counted and reported so the process can exit non-zero.
function assert(condition: unknown, message: string): void {
  if (!condition) {
    failures++;
    console.error(`❌ Assertion failed: ${message}`);
  }
}

// Test 1: Tokens verification
console.log('1. Verifying Built-in Directives & Functions...');
assert(GAWK_DIRECTIVES.has('@include'), 'Directives should contain @include');
assert(GAWK_DIRECTIVES.has('@namespace'), 'Directives should contain @namespace');
assert(GAWK_DIRECTIVES.has('@load'), 'Directives should contain @load');
assert(GAWK_BUILTIN_FUNCTIONS['gensub'], 'Built-ins should contain gensub');
assert(GAWK_BUILTIN_FUNCTIONS['patsplit'], 'Built-ins should contain patsplit');
assert(GAWK_BUILTIN_FUNCTIONS['strftime'], 'Built-ins should contain strftime');
console.log('✅ Tokens & Built-ins verified!');

// Test 1b: Statements tokenize as keywords, not variables
console.log('1b. Verifying print/printf/getline tokenize as keywords...');
assert(GAWK_KEYWORDS.has('print'), 'Keywords should contain print');
assert(GAWK_KEYWORDS.has('printf'), 'Keywords should contain printf');
assert(GAWK_KEYWORDS.has('getline'), 'Keywords should contain getline');

function firstToken(code: string): string | null {
  const state = awkStreamParser.startState();
  const stream = new StringStream(code, 4, 4);
  return awkStreamParser.token(stream, state);
}

assert(firstToken('print "hello"') === 'keyword', "'print' should tokenize as keyword");
assert(firstToken('printf "%d\\n", n') === 'keyword', "'printf' should tokenize as keyword");
assert(firstToken('getline line < file') === 'keyword', "'getline' should tokenize as keyword");
assert(firstToken('printout = 1') === 'variableName', "'printout' should still be a variable");
console.log('✅ Statements tokenize as keywords!');

// Test 1c: All keywords from the gawk manual are recognized
console.log('1c. Verifying all gawk manual keywords are covered...');
const GAWK_MANUAL_KEYWORDS = [
  'break', 'case', 'continue', 'default', 'delete', 'do', 'else',
  'exit', 'for', 'function', 'func', 'if', 'in', 'next', 'nextfile',
  'switch', 'while'
];
for (const kw of GAWK_MANUAL_KEYWORDS) {
  assert(GAWK_KEYWORDS.has(kw), `Keywords should contain ${kw}`);
}
for (const pattern of ['BEGIN', 'BEGINFILE', 'END', 'ENDFILE']) {
  assert(
    firstToken(pattern + ' { print }') === 'special(keyword)',
    `'${pattern}' should tokenize as special(keyword)`
  );
}
assert(
  firstToken('switch (x) { case 1: print x; default: print "?" }') === 'keyword',
  "'switch' should tokenize as keyword"
);
console.log('✅ All gawk manual keywords covered!');

// Test 2: Language Instantiation
console.log('2. Verifying EditorState initialization...');
const state = EditorState.create({
  doc: '@include "test.awk"\nBEGIN { print "hello" }',
  extensions: [awkLanguage]
});

assert(state.doc.toString().includes('BEGIN'), 'Doc should contain BEGIN');
console.log('✅ EditorState initialized successfully!');

// Test 3: Function parameters tokenize as variables, not function definitions
console.log('3. Verifying function parameters are not mislabeled as definitions...');

function tokenizeLines(lines: string[]): Map<string, string | null> {
  const parserState = awkStreamParser.startState();
  const tokens = new Map<string, string | null>();
  for (const line of lines) {
    const stream = new StringStream(line, 4, 4);
    while (!stream.eol()) {
      const pos = stream.pos;
      const style = awkStreamParser.token(stream, parserState);
      if (stream.pos === pos) stream.next(); // safety: always advance
      if (style) tokens.set(stream.current(), style);
      stream.start = stream.pos; // normally done by the editor between tokens
    }
  }
  return tokens;
}

const funcTokens = tokenizeLines([
  'function nextPrime(prime,    candidate) {',
  '    candidate = prime + 2'
]);
assert(
  funcTokens.get('nextPrime') === 'function(definition)',
  "'nextPrime' should tokenize as function(definition)"
);
assert(
  funcTokens.get('prime') === 'variableName',
  "parameter 'prime' should tokenize as variableName"
);
assert(
  funcTokens.get('candidate') === 'variableName',
  "parameter 'candidate' should tokenize as variableName"
);
console.log('✅ Function parameters tokenize as variables!');

if (failures > 0) {
  console.error(`--- ${failures} Check(s) FAILED! ---`);
  process.exit(1);
}
console.log('--- All Plugin Checks Passed! ---');
