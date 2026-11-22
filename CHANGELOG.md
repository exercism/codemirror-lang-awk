# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-11-22

### Fixed

- Function parameters and identifiers in function bodies were mislabeled as
  `function(definition)` tokens: the tokenizer kept `lastToken = 'function'`
  through the entire parameter list. Now only the identifier immediately
  following `function`/`func` is treated as a definition.
- Added missing gawk keywords `switch`, `case`, and `default`, completing the
  keyword list from the gawk manual.
- The I/O statements `print`, `printf`, and `getline` now tokenize as keywords
  instead of plain variables.

## [2.0.0] - 2026-11-21

This project was renamed from "gawk" to "awk". The public API now uses `awk` naming
throughout. This is a **breaking change**: the old `gawk*` names are no longer exported.

### Changed

- **BREAKING:** Renamed exports:
  - `gawk()` → `awk()`
  - `gawkLanguage` → `awkLanguage`
  - `gawkHighlighting` → `awkHighlighting`
  - `gawkStreamParser` → `awkStreamParser`
  - `gawkHighlightStyle` → `awkHighlightStyle`
  - `gawkCompletionSource` → `awkCompletionSource`
  - `gawkLinter` → `awkLinter`
  - `gawkDarkTheme` → `awkDarkTheme`
  - `gawkLightTheme` → `awkLightTheme`
  - `GawkState` → `AwkState`
  - `GawkLanguageOptions` → `AwkLanguageOptions`
- **BREAKING:** Renamed the highlighting CSS classes from `cm-gawk-*` to `cm-awk-*`
  (`directive`, `pattern`, `keyword`, `builtin-var`, `field`, `builtin-func`,
  `func-def`, `func-call`, `string`, `regex`, `number`, `comment`, `operator`,
  `punctuation`). Custom stylesheets targeting the old classes must be updated.
- The stream parser's language name is now `'awk'` (was `'gawk'`).
- Updated the README, demo and tests to use the new names.

### Unchanged

- The `GAWK_*` token constants (`GAWK_PATTERNS`, `GAWK_KEYWORDS`, `GAWK_DIRECTIVES`,
  `GAWK_BUILTIN_VARS`, `GAWK_BUILTIN_FUNCTIONS`) keep their names.

### Migration

```diff
- import { gawk, gawkDarkTheme } from '@exercism/codemirror-lang-awk';
+ import { awk, awkDarkTheme } from '@exercism/codemirror-lang-awk';

- extensions: [basicSetup, gawk(), gawkDarkTheme]
+ extensions: [basicSetup, awk(), awkDarkTheme]
```

## [1.0.0] - 2026-11-20

Initial release of the CodeMirror 6 language package for AWK and GNU AWK (gawk).

### Added

- Stream parser (`gawkStreamParser` / `gawkLanguage`) supporting POSIX AWK and GNU AWK:
  directives (`@include`, `@load`, `@namespace`), pattern blocks (`BEGIN`, `END`,
  `BEGINFILE`, `ENDFILE`), control keywords, regex literals, field references
  (`$0`, `$NF`), and hex/octal numbers.
- Syntax highlighting (`gawkHighlighting`) with bundled dark and light themes
  (`gawkDarkTheme`, `gawkLightTheme`).
- Context-aware autocompletion (`gawkCompletionSource`): directives, built-in functions
  with signatures and documentation, built-in variables, snippets, and a scanner for
  user-defined functions and variables in the document.
- Diagnostic linter (`gawkLinter`): unterminated strings and regexes, unmatched braces
  and parentheses, unknown directives, and malformed function definitions.
- `gawk()` extension bundling highlighting, autocompletion and linting, with `lint` and
  `autocomplete` options.
- Interactive demo (`npm run dev`).

[2.0.1]: https://github.com/exercism/codemirror-lang-awk/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/exercism/codemirror-lang-awk/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/exercism/codemirror-lang-awk/releases/tag/v1.0.0
