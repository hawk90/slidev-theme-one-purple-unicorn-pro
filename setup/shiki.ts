import { defineShikiSetup } from '@slidev/types'

const purpleUnicornTheme = {
  name: 'one-purple-unicorn',
  type: 'dark' as const,
  fg: '#c0caf5',
  bg: '#282c34',
  settings: [
    // --- Comments ---
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#7982b4', fontStyle: 'italic' },
    },
    // --- Keywords ---
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.logical',
        'keyword.operator.delete',
        'keyword.operator.typeof',
        'keyword.operator.void',
        'keyword.operator.instanceof',
        'storage',
        'storage.type',
        'storage.modifier',
      ],
      settings: { foreground: '#bb9af7' },
    },
    // --- Import / Export / From ---
    {
      scope: [
        'keyword.control.import',
        'keyword.control.export',
        'keyword.control.from',
        'keyword.control.as',
        'meta.import keyword',
        'meta.export keyword',
      ],
      settings: { foreground: '#7dcfff' },
    },
    // --- Functions ---
    {
      scope: [
        'entity.name.function',
        'meta.function-call entity.name.function',
        'support.function',
        'meta.function-call',
      ],
      settings: { foreground: '#7aa2f7' },
    },
    // --- Strings ---
    {
      scope: [
        'string',
        'string.quoted',
        'string.template',
        'string.quoted.docstring',
      ],
      settings: { foreground: '#9ece6a' },
    },
    // --- Template literal expressions ---
    {
      scope: [
        'punctuation.definition.template-expression',
        'string.template punctuation.definition.template-expression',
      ],
      settings: { foreground: '#7dcfff' },
    },
    // --- Numbers, booleans, null ---
    {
      scope: [
        'constant.numeric',
        'constant.language',
        'constant.language.boolean',
        'constant.language.null',
        'constant.language.undefined',
      ],
      settings: { foreground: '#ff9e64' },
    },
    // --- Types, classes, interfaces ---
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'support.class',
        'entity.other.inherited-class',
        'meta.type.annotation',
      ],
      settings: { foreground: '#2ac3de' },
    },
    // --- Properties, object keys ---
    {
      scope: [
        'variable.other.property',
        'variable.other.object.property',
        'meta.object-literal.key',
        'support.type.property-name.json',
        'support.type.property-name',
      ],
      settings: { foreground: '#73daca' },
    },
    // --- Variables ---
    {
      scope: [
        'variable',
        'variable.other.readwrite',
        'variable.other.local',
        'meta.definition.variable',
      ],
      settings: { foreground: '#c0caf5' },
    },
    // --- Parameters ---
    {
      scope: [
        'variable.parameter',
        'meta.parameter',
      ],
      settings: { foreground: '#e0af68' },
    },
    // --- this / self ---
    {
      scope: [
        'variable.language.this',
        'variable.language.self',
        'variable.language.special',
      ],
      settings: { foreground: '#f472b6', fontStyle: 'italic' },
    },
    // --- Operators, punctuation ---
    {
      scope: [
        'keyword.operator',
        'keyword.operator.assignment',
        'keyword.operator.comparison',
        'keyword.operator.arithmetic',
        'punctuation.accessor',
        'punctuation.separator',
      ],
      settings: { foreground: '#89ddff' },
    },
    // --- Brackets, braces, parens ---
    {
      scope: [
        'punctuation.definition.block',
        'punctuation.definition.parameters',
        'punctuation.section',
        'meta.brace',
      ],
      settings: { foreground: '#89ddff' },
    },
    // --- HTML/JSX tags ---
    {
      scope: [
        'entity.name.tag',
        'punctuation.definition.tag',
        'support.class.component',
      ],
      settings: { foreground: '#f472b6' },
    },
    // --- HTML/JSX attributes ---
    {
      scope: [
        'entity.other.attribute-name',
      ],
      settings: { foreground: '#a78bfa' },
    },
    // --- Decorators ---
    {
      scope: [
        'meta.decorator',
        'punctuation.decorator',
        'meta.decorator entity.name.function',
      ],
      settings: { foreground: '#bb9af7' },
    },
    // --- Regex ---
    {
      scope: [
        'string.regexp',
        'keyword.other.regex',
      ],
      settings: { foreground: '#b4f9f8' },
    },
    // --- Escape sequences ---
    {
      scope: [
        'constant.character.escape',
      ],
      settings: { foreground: '#89ddff' },
    },
    // --- CSS selectors ---
    {
      scope: [
        'entity.other.attribute-name.class.css',
        'entity.other.attribute-name.id.css',
        'entity.name.tag.css',
      ],
      settings: { foreground: '#34d399' },
    },
    // --- CSS property names ---
    {
      scope: [
        'support.type.property-name.css',
      ],
      settings: { foreground: '#73daca' },
    },
    // --- CSS values ---
    {
      scope: [
        'support.constant.property-value.css',
        'meta.property-value.css',
      ],
      settings: { foreground: '#c0caf5' },
    },
    // --- CSS units & colors ---
    {
      scope: [
        'keyword.other.unit.css',
        'constant.other.color.rgb-value.hex.css',
        'punctuation.definition.constant.css',
      ],
      settings: { foreground: '#ff9e64' },
    },
    // --- Markdown headings ---
    {
      scope: [
        'markup.heading',
        'entity.name.section',
      ],
      settings: { foreground: '#bb9af7', fontStyle: 'bold' },
    },
    // --- Markdown bold ---
    {
      scope: ['markup.bold'],
      settings: { foreground: '#ff9e64', fontStyle: 'bold' },
    },
    // --- Markdown italic ---
    {
      scope: ['markup.italic'],
      settings: { foreground: '#bb9af7', fontStyle: 'italic' },
    },
    // --- Markdown links ---
    {
      scope: ['markup.underline.link'],
      settings: { foreground: '#7aa2f7' },
    },
    // --- Markdown inline code ---
    {
      scope: ['markup.inline.raw'],
      settings: { foreground: '#9ece6a' },
    },
    // --- Error / Invalid ---
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: '#f87171' },
    },
    // --- Python: builtins ---
    {
      scope: [
        'support.function.builtin.python',
        'support.type.python',
      ],
      settings: { foreground: '#7aa2f7' },
    },
    // --- Python: magic methods ---
    {
      scope: [
        'support.function.magic.python',
      ],
      settings: { foreground: '#7dcfff', fontStyle: 'italic' },
    },
    // --- Rust: lifetimes ---
    {
      scope: ['storage.modifier.lifetime.rust'],
      settings: { foreground: '#e0af68', fontStyle: 'italic' },
    },
    // --- Shell: variables ---
    {
      scope: [
        'variable.other.normal.shell',
        'punctuation.definition.variable.shell',
      ],
      settings: { foreground: '#c0caf5' },
    },
    // --- YAML keys ---
    {
      scope: ['entity.name.tag.yaml'],
      settings: { foreground: '#73daca' },
    },
    // --- TOML keys ---
    {
      scope: ['support.type.property-name.toml'],
      settings: { foreground: '#73daca' },
    },
    // --- JSON string values ---
    {
      scope: ['string.quoted.double.json'],
      settings: { foreground: '#9ece6a' },
    },
    // --- Punctuation: string delimiters ---
    {
      scope: [
        'punctuation.definition.string',
      ],
      settings: { foreground: '#9ece6a' },
    },
  ],
}

export default defineShikiSetup(() => ({
  themes: {
    light: purpleUnicornTheme,
    dark: purpleUnicornTheme,
  },
}))
