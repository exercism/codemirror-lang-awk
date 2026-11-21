import { StreamLanguage, LanguageSupport, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import { Extension } from '@codemirror/state';
import { awkStreamParser } from './grammar';
import { awkHighlightStyle } from './highlight';
import { awkCompletionSource } from './completion';
import { awkLinter } from './linter';
import { awkDarkTheme, awkLightTheme } from './theme';

export * from './tokens';
export * from './grammar';
export * from './highlight';
export * from './completion';
export * from './linter';
export * from './theme';

/**
 * Highlighting Style extension for GNU AWK
 */
export const awkHighlighting = syntaxHighlighting(HighlightStyle.define(awkHighlightStyle));

/**
 * CodeMirror 6 StreamLanguage definition for GNU AWK
 */
export const awkLanguage = StreamLanguage.define(awkStreamParser);

export interface AwkLanguageOptions {
  /**
   * Enable diagnostic linting for syntax errors. Default: true.
   */
  lint?: boolean;
  /**
   * Enable autocompletion source. Default: true.
   */
  autocomplete?: boolean;
}

/**
 * Main CodeMirror 6 plugin extension function for GNU AWK (awk).
 *
 * @param options Configuration options for linting and autocompletion
 * @returns LanguageSupport instance for CodeMirror 6
 *
 * @example
 * ```ts
 * import { EditorView } from '@codemirror/view';
 * import { basicSetup } from 'codemirror';
 * import { awk } from '@exercism/codemirror-lang-awk';
 *
 * new EditorView({
 *   doc: 'BEGIN { print "Hello, GNU AWK!" }',
 *   extensions: [basicSetup, awk()]
 * });
 * ```
 */
export function awk(options: AwkLanguageOptions = {}): LanguageSupport {
  const extensions: Extension[] = [awkHighlighting];

  if (options.autocomplete !== false) {
    extensions.push(
      autocompletion({
        override: [awkCompletionSource]
      })
    );
  }

  if (options.lint !== false) {
    extensions.push(awkLinter());
  }

  return new LanguageSupport(awkLanguage, extensions);
}
