import { tags as t } from '@lezer/highlight';

/**
 * Custom Highlighting Tags mapping for GNU AWK StreamLanguage
 */
export const awkHighlightStyle = [
  { tag: t.keyword, class: 'cm-awk-keyword' },
  { tag: t.special(t.keyword), class: 'cm-awk-pattern' },
  { tag: t.processingInstruction, class: 'cm-awk-directive' },
  { tag: t.meta, class: 'cm-awk-directive' },
  { tag: t.standard(t.variableName), class: 'cm-awk-builtin-var' },
  { tag: t.special(t.variableName), class: 'cm-awk-field' },
  { tag: t.standard(t.name), class: 'cm-awk-builtin-func' },
  { tag: t.definition(t.function(t.variableName)), class: 'cm-awk-func-def' },
  { tag: t.function(t.variableName), class: 'cm-awk-func-call' },
  { tag: t.string, class: 'cm-awk-string' },
  { tag: t.regexp, class: 'cm-awk-regex' },
  { tag: t.number, class: 'cm-awk-number' },
  { tag: t.comment, class: 'cm-awk-comment' },
  { tag: t.operator, class: 'cm-awk-operator' },
  { tag: t.punctuation, class: 'cm-awk-punctuation' }
];
