import { parser } from "./syntax.grammar";
import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

export const awkLanguage = LRLanguage.define({
  name: "awk",
  parser: parser.configure({
    props: [
      styleTags({
        LineComment: t.lineComment,
        IntegerLiteral: t.number,
        FloatingLiteral: t.float,
        BooleanLiteral: t.bool,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//" },
  },
});

export function awk() {
  return new LanguageSupport(awkLanguage);
}
