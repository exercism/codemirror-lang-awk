import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';

/**
 * Built-in Modern Dark Visual Theme for GNU AWK Editor
 */
export const awkDarkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Source Code Pro', monospace",
      fontSize: '14px',
      borderRadius: '8px'
    },
    '.cm-content': {
      caretColor: '#38bdf8'
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#38bdf8'
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: '#1e293b'
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(51, 65, 85, 0.4)'
    },
    '.cm-gutters': {
      backgroundColor: '#0b1329',
      color: '#64748b',
      borderRight: '1px solid #1e293b'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#1e293b',
      color: '#38bdf8'
    },
    '.cm-foldPlaceholder': {
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      border: 'none',
      borderRadius: '4px',
      padding: '0 4px'
    },
    // GNU AWK Syntax Highlighting Classes
    '.cm-awk-directive': { color: '#c084fc', fontWeight: 'bold' }, // @include, @namespace
    '.cm-awk-pattern': { color: '#f59e0b', fontWeight: 'bold' }, // BEGIN, END
    '.cm-awk-keyword': { color: '#f43f5e', fontWeight: 'bold' }, // if, else, for, while
    '.cm-awk-builtin-var': { color: '#38bdf8', fontWeight: '600' }, // FS, NF, NR, ARGIND
    '.cm-awk-field': { color: '#4ade80', fontWeight: 'bold' }, // $0, $1, $NF
    '.cm-awk-builtin-func': { color: '#60a5fa' }, // gensub, patsplit, strftime
    '.cm-awk-func-def': { color: '#a78bfa', fontWeight: 'bold' },
    '.cm-awk-func-call': { color: '#38bdf8' },
    '.cm-awk-string': { color: '#a3e635' },
    '.cm-awk-regex': { color: '#fb923c' },
    '.cm-awk-number': { color: '#facc15' },
    '.cm-awk-comment': { color: '#64748b', fontStyle: 'italic' },
    '.cm-awk-operator': { color: '#cbd5e1' },
    '.cm-awk-punctuation': { color: '#94a3b8' }
  },
  { dark: true }
);

/**
 * Built-in Modern Light Visual Theme for GNU AWK Editor
 */
export const awkLightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Source Code Pro', monospace",
      fontSize: '14px',
      borderRadius: '8px'
    },
    '.cm-content': {
      caretColor: '#0284c7'
    },
    '.cm-gutters': {
      backgroundColor: '#f8fafc',
      color: '#94a3b8',
      borderRight: '1px solid #e2e8f0'
    },
    '.cm-activeLine': {
      backgroundColor: '#f1f5f9'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#e2e8f0',
      color: '#0284c7'
    },

    // Light mode syntax highlighting
    '.cm-awk-directive': { color: '#7e22ce', fontWeight: 'bold' },
    '.cm-awk-pattern': { color: '#d97706', fontWeight: 'bold' },
    '.cm-awk-keyword': { color: '#be123c', fontWeight: 'bold' },
    '.cm-awk-builtin-var': { color: '#0369a1', fontWeight: '600' },
    '.cm-awk-field': { color: '#15803d', fontWeight: 'bold' },
    '.cm-awk-builtin-func': { color: '#1d4ed8' },
    '.cm-awk-func-def': { color: '#6d28d9', fontWeight: 'bold' },
    '.cm-awk-func-call': { color: '#0284c7' },
    '.cm-awk-string': { color: '#4d7c0f' },
    '.cm-awk-regex': { color: '#c2410c' },
    '.cm-awk-number': { color: '#b45309' },
    '.cm-awk-comment': { color: '#64748b', fontStyle: 'italic' },
    '.cm-awk-operator': { color: '#334155' },
    '.cm-awk-punctuation': { color: '#475569' }
  },
  { dark: false }
);
