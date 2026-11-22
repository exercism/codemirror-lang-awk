import { Diagnostic, linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { GAWK_DIRECTIVES } from './tokens';

/**
 * Find the index of the first '#' that starts a comment, i.e. one that is not
 * inside a string or regexp literal. Returns -1 if the line has no comment.
 */
export function findCommentStart(text: string): number {
  let inStr = false;
  let inRegex = false;
  let inCharClass = false;

  for (let c = 0; c < text.length; c++) {
    const char = text[c];
    const prevChar = c > 0 ? text[c - 1] : '';

    if (inStr) {
      if (char === '"' && prevChar !== '\\') {
        inStr = false;
      }
    } else if (inRegex) {
      if (char === '[' && prevChar !== '\\') {
        inCharClass = true;
      } else if (char === ']' && prevChar !== '\\') {
        inCharClass = false;
      } else if (char === '/' && prevChar !== '\\' && !inCharClass) {
        inRegex = false;
      }
    } else if (char === '#') {
      return c;
    } else if (char === '"') {
      inStr = true;
    } else if (char === '/') {
      // Heuristic: a '/' starts a regexp when it follows an operator, an
      // opening delimiter, or a keyword that expects an expression.
      const before = text.slice(0, c).trim();
      if (
        before === '' ||
        /[=~,\(\!\?\:\{\;\+\-\*\%\&\|]$/.test(before) ||
        /\b(print|printf|return|match|sub|gsub|gensub|patsplit|split|if|while)\s*$/i.test(before)
      ) {
        inRegex = true;
      }
    }
  }
  return -1;
}

/**
 * Diagnostic Linter for GNU AWK syntax checks
 */
export function awkLinter(): Extension {
  return linter((view) => {
    const diagnostics: Diagnostic[] = [];
    const doc = view.state.doc;
    const lines = doc.lines;

    let openBraces: { pos: number; line: number }[] = [];
    let openParens: { pos: number; line: number }[] = [];

    for (let i = 1; i <= lines; i++) {
      const line = doc.line(i);
      const text = line.text;

      // Strip trailing comment ('#' inside a string or regexp is not a comment)
      const commentIdx = findCommentStart(text);
      const codeText = commentIdx !== -1 ? text.slice(0, commentIdx) : text;

      // 1. Check GNU Directives syntax
      const directiveMatch = codeText.match(/@([a-zA-Z0-9_]+)/g);
      if (directiveMatch) {
        for (const dirToken of directiveMatch) {
          if (!GAWK_DIRECTIVES.has(dirToken)) {
            const pos = line.from + codeText.indexOf(dirToken);
            diagnostics.push({
              from: pos,
              to: pos + dirToken.length,
              severity: 'error',
              message: `Unknown GNU AWK directive '${dirToken}'. Valid directives: @include, @load, @namespace.`
            });
          }
        }
      }

      // Check @include / @namespace missing quoted argument
      if (/@include\b(?!\s*["<])/.test(codeText)) {
        const pos = line.from + codeText.indexOf('@include');
        diagnostics.push({
          from: pos,
          to: pos + 8,
          severity: 'warning',
          message: '@include directive expects a quoted filename e.g. @include "filename.awk"'
        });
      }

      if (/@namespace\b(?!\s*["<])/.test(codeText)) {
        const pos = line.from + codeText.indexOf('@namespace');
        diagnostics.push({
          from: pos,
          to: pos + 10,
          severity: 'warning',
          message: '@namespace directive expects a quoted string e.g. @namespace "my_module"'
        });
      }

      // Check function keyword syntax
      const funcKeywordMatch = codeText.match(/\b(?:function|func)\b/);
      if (funcKeywordMatch) {
        const afterFunc = codeText.slice(funcKeywordMatch.index! + funcKeywordMatch[0].length).trim();
        if (afterFunc === '' || afterFunc.startsWith('{') || afterFunc.startsWith('(')) {
          const pos = line.from + funcKeywordMatch.index!;
          diagnostics.push({
            from: pos,
            to: pos + funcKeywordMatch[0].length,
            severity: 'error',
            message: 'Function definition missing function name.'
          });
        } else {
          const funcDeclMatch = codeText.match(/\b(?:function|func)\s+([A-Za-z_][A-Za-z0-9_]*)/);
          if (funcDeclMatch) {
            const funcName = funcDeclMatch[1];
            const afterName = codeText.slice(funcDeclMatch.index! + funcDeclMatch[0].length).trim();
            if (!afterName.startsWith('(')) {
              const pos = line.from + funcDeclMatch.index!;
              diagnostics.push({
                from: pos,
                to: pos + funcDeclMatch[0].length,
                severity: 'error',
                message: `Function definition '${funcName}' missing parameter parentheses '()'.`
              });
            }
          }
        }
      }

      // 2. Scan string literals & regexes & braces on this line
      let inStr = false;
      let strChar = '';
      let strStartPos = 0;
      let inRegex = false;
      let regexStartPos = 0;
      let inCharClass = false;

      for (let c = 0; c < codeText.length; c++) {
        const char = codeText[c];
        const prevChar = c > 0 ? codeText[c - 1] : '';

        if (inStr) {
          if (char === strChar && prevChar !== '\\') {
            inStr = false;
          }
        } else if (inRegex) {
          if (char === '[' && prevChar !== '\\') {
            inCharClass = true;
          } else if (char === ']' && prevChar !== '\\') {
            inCharClass = false;
          } else if (char === '/' && prevChar !== '\\' && !inCharClass) {
            inRegex = false;
          }
        } else {
          if (char === '"') {
            inStr = true;
            strChar = '"';
            strStartPos = line.from + c;
          } else if (char === '/') {
            const before = codeText.slice(0, c).trim();
            if (
              before === '' ||
              /[=~,\(\!\?\:\{\;\+\-\*\%\&\|]$/.test(before) ||
              /\b(print|printf|return|match|sub|gsub|gensub|patsplit|split|if|while)\s*$/i.test(before)
            ) {
              inRegex = true;
              inCharClass = false;
              regexStartPos = line.from + c;
            }
          } else if (char === '{') {
            const lineParens = openParens.filter((p) => p.line === i);
            for (const paren of lineParens) {
              diagnostics.push({
                from: paren.pos,
                to: paren.pos + 1,
                severity: 'error',
                message: 'Unclosed parenthesis "(" in condition before brace.'
              });
            }
            openParens = openParens.filter((p) => p.line !== i);
            openBraces.push({ pos: line.from + c, line: i });
          } else if (char === '}') {
            if (openBraces.length > 0) {
              openBraces.pop();
            } else {
              diagnostics.push({
                from: line.from + c,
                to: line.from + c + 1,
                severity: 'error',
                message: 'Unmatched closing brace "}".'
              });
            }
          } else if (char === '(') {
            openParens.push({ pos: line.from + c, line: i });
          } else if (char === ')') {
            if (openParens.length > 0) {
              openParens.pop();
            } else {
              diagnostics.push({
                from: line.from + c,
                to: line.from + c + 1,
                severity: 'error',
                message: 'Unmatched closing parenthesis ")".'
              });
            }
          }
        }
      }

      // Check unclosed string on line (AWK string literals cannot span unescaped newlines)
      if (inStr && !codeText.endsWith('\\')) {
        diagnostics.push({
          from: strStartPos,
          to: line.to,
          severity: 'error',
          message: 'Unterminated string literal.'
        });
      }

      // Check unclosed regex on line
      if (inRegex && !codeText.endsWith('\\')) {
        diagnostics.push({
          from: regexStartPos,
          to: line.to,
          severity: 'error',
          message: 'Unterminated regular expression.'
        });
      }
    }

    // Report unclosed braces
    for (const brace of openBraces) {
      diagnostics.push({
        from: brace.pos,
        to: brace.pos + 1,
        severity: 'error',
        message: 'Unclosed brace "{"'
      });
    }

    // Report unclosed parentheses
    for (const paren of openParens) {
      diagnostics.push({
        from: paren.pos,
        to: paren.pos + 1,
        severity: 'error',
        message: 'Unclosed parenthesis "("'
      });
    }

    return diagnostics;
  });
}
