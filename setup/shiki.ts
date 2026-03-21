import { defineShikiSetup } from '@slidev/types'

const purpleUnicornTheme = {
  name: 'one-purple-unicorn',
  type: 'dark' as const,
  fg: '#abb2bf',
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
      settings: { foreground: '#c678dd' },
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
      settings: { foreground: '#c678dd' },
    },
    // --- Preprocessor (C/C++) ---
    {
      scope: [
        'keyword.control.directive',
        'keyword.control.import.include',
        'meta.preprocessor',
        'punctuation.definition.directive',
      ],
      settings: { foreground: '#c678dd' },
    },
    // --- Preprocessor macro names ---
    {
      scope: [
        'entity.name.function.preprocessor',
        'meta.preprocessor.macro',
      ],
      settings: { foreground: '#61afef' },
    },
    // --- Include paths ---
    {
      scope: [
        'string.quoted.other.lt-gt.include',
        'string.quoted.double.include',
      ],
      settings: { foreground: '#98c379' },
    },
    // --- CUDA qualifiers (__global__, __device__, __shared__, etc.) ---
    {
      scope: [
        'storage.modifier.cuda-cpp',
        'keyword.function.qualifier.cuda-cpp',
        'storage.type.modifier.cuda-cpp',
      ],
      settings: { foreground: '#e06c75', fontStyle: 'bold' },
    },
    // --- CUDA built-in variables (threadIdx, blockIdx, blockDim, gridDim) ---
    {
      scope: [
        'variable.language.cuda-cpp',
        'support.variable.cuda-cpp',
      ],
      settings: { foreground: '#56b6c2' },
    },
    // --- CUDA API functions (cudaMalloc, cudaMemcpy, etc.) ---
    {
      scope: [
        'support.function.cuda-cpp',
      ],
      settings: { foreground: '#61afef' },
    },
    // --- C++ class/struct/enum/union declaration keywords ---
    {
      scope: [
        'storage.type.struct',
        'storage.type.enum',
        'storage.type.union',
        'storage.type.class',
        'storage.type.struct.declare.cpp',
        'storage.type.enum.declare.cpp',
        'storage.type.union.declare.cpp',
        'storage.type.class.declare.cpp',
      ],
      settings: { foreground: '#c678dd' },
    },
    // --- C++ template ---
    {
      scope: [
        'storage.type.template.cpp',
        'storage.type.template.argument',
        'storage.type.template.argument.cpp',
        'entity.name.type.template',
        'entity.name.type.parameter.cpp',
      ],
      settings: { foreground: '#e5c07b' },
    },
    // --- C++ access control & modifiers ---
    {
      scope: [
        'storage.type.modifier.access.control.cpp',
        'storage.type.modifier.virtual.cpp',
        'storage.type.modifier.final.cpp',
        'storage.modifier.inline.cpp',
        'storage.modifier.specifier.extern.cpp',
      ],
      settings: { foreground: '#c678dd' },
    },
    // --- C++ pointer/reference modifiers ---
    {
      scope: [
        'storage.modifier.pointer.cpp',
        'storage.modifier.reference.cpp',
      ],
      settings: { foreground: '#56b6c2' },
    },
    // --- C++ lambda ---
    {
      scope: [
        'storage.modifier.lambda.cpp',
        'storage.type.return-type.lambda.cpp',
        'punctuation.definition.capture.begin.lambda.cpp',
        'punctuation.definition.capture.end.lambda.cpp',
        'punctuation.definition.lambda.return-type.cpp',
      ],
      settings: { foreground: '#c678dd' },
    },
    // --- C++ type casting keywords ---
    {
      scope: [
        'keyword.other.typename.cpp',
        'keyword.other.typedef.cpp',
        'keyword.other.static_assert.cpp',
        'keyword.operator.cast.cpp',
        'keyword.other.default.constructor.cpp',
        'keyword.other.delete.constructor.cpp',
      ],
      settings: { foreground: '#c678dd' },
    },
    // --- C++ specific operators ---
    {
      scope: [
        'keyword.operator.arithmetic.cpp',
        'keyword.operator.comparison.cpp',
        'keyword.operator.logical.cpp',
        'keyword.operator.bitwise.cpp',
        'keyword.operator.bitwise.shift.cpp',
        'keyword.operator.assignment.cpp',
        'keyword.operator.assignment.compound.cpp',
        'keyword.operator.increment.cpp',
        'keyword.operator.decrement.cpp',
        'keyword.operator.ternary.cpp',
      ],
      settings: { foreground: '#56b6c2' },
    },
    // --- C++ sizeof/typeid/alignof/noexcept ---
    {
      scope: [
        'keyword.operator.sizeof.cpp',
        'keyword.operator.typeid.cpp',
        'keyword.operator.alignof.cpp',
        'keyword.operator.alignas.cpp',
        'keyword.operator.noexcept.cpp',
        'keyword.operator.functionlike.cpp',
      ],
      settings: { foreground: '#c678dd' },
    },
    // --- Functions ---
    {
      scope: [
        'entity.name.function',
        'meta.function-call entity.name.function',
        'support.function',
        'meta.function-call',
        'entity.name.function.definition',
        'entity.name.function.definition.cpp',
        'entity.name.function.call.cpp',
        'entity.name.function.member.cpp',
        'entity.name.function.preprocessor.cpp',
      ],
      settings: { foreground: '#61afef' },
    },
    // --- C++ constructors & destructors ---
    {
      scope: [
        'entity.name.function.definition.special.constructor.cpp',
        'entity.name.function.definition.special.member.destructor.cpp',
        'entity.name.function.constructor.cpp',
        'entity.name.function.destructor.cpp',
      ],
      settings: { foreground: '#61afef', fontStyle: 'bold' },
    },
    // --- C++ operator overloading ---
    {
      scope: [
        'entity.name.operator.cpp',
        'entity.name.operator.custom-literal.cpp',
        'entity.name.operator.type.cpp',
        'entity.name.operator.type.array.cpp',
      ],
      settings: { foreground: '#d19a66' },
    },
    // --- C++ built-in types (int, float, void, size_t, etc.) ---
    {
      scope: [
        'storage.type.built-in',
        'storage.type.built-in.cpp',
        'storage.type.built-in.primitive.cpp',
        'storage.type.integral.cpp',
        'storage.type.primitive',
        'support.type.posix-reserved',
        'support.type.posix-reserved.cpp',
        'keyword.other.type',
      ],
      settings: { foreground: '#e5c07b' },
    },
    // --- C++ namespace & scope resolution ---
    {
      scope: [
        'entity.name.namespace',
        'entity.name.namespace.cpp',
        'entity.name.namespace.alias.cpp',
        'entity.name.scope-resolution',
        'entity.name.scope-resolution.cpp',
        'entity.name.scope-resolution.function.definition.cpp',
        'entity.name.scope-resolution.function.call.cpp',
        'entity.name.scope-resolution.constructor.cpp',
        'entity.name.scope-resolution.destructor.cpp',
        'entity.name.scope-resolution.operator.cpp',
        'entity.name.scope-resolution.type.cpp',
      ],
      settings: { foreground: '#e5c07b' },
    },
    // --- C++ scope resolution operator (::) ---
    {
      scope: [
        'punctuation.separator.namespace.access.cpp',
        'punctuation.separator.scope-resolution.cpp',
      ],
      settings: { foreground: '#56b6c2' },
    },
    // --- C++ pointer/reference access (-> .) ---
    {
      scope: [
        'punctuation.separator.pointer-access.cpp',
        'punctuation.separator.dot-access.cpp',
      ],
      settings: { foreground: '#abb2bf' },
    },
    // --- C++ enum members ---
    {
      scope: [
        'variable.other.enummember.cpp',
      ],
      settings: { foreground: '#d19a66' },
    },
    // --- C++ attributes ([[nodiscard]], [[deprecated]], etc.) ---
    {
      scope: [
        'support.other.attribute.cpp',
        'punctuation.section.attribute.begin.cpp',
        'punctuation.section.attribute.end.cpp',
      ],
      settings: { foreground: '#e5c07b' },
    },
    // --- C++ user-defined literals & number suffixes ---
    {
      scope: [
        'keyword.other.suffix.literal.user-defined.string.cpp',
        'keyword.other.suffix.literal.user-defined.integer.cpp',
        'keyword.other.suffix.literal.user-defined.character.cpp',
        'keyword.other.suffix.literal.built-in.integer.cpp',
        'keyword.other.suffix.literal.built-in.floating-point.cpp',
      ],
      settings: { foreground: '#d19a66' },
    },
    // --- Assembly ---
    {
      scope: ['storage.type.asm.cpp'],
      settings: { foreground: '#c678dd' },
    },
    // --- Strings ---
    {
      scope: [
        'string',
        'string.quoted',
        'string.template',
        'string.quoted.docstring',
      ],
      settings: { foreground: '#98c379' },
    },
    // --- Template literal expressions ---
    {
      scope: [
        'punctuation.definition.template-expression',
        'string.template punctuation.definition.template-expression',
      ],
      settings: { foreground: '#56b6c2' },
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
      settings: { foreground: '#d19a66' },
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
      settings: { foreground: '#e5c07b' },
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
      settings: { foreground: '#e06c75' },
    },
    // --- Variables ---
    {
      scope: [
        'variable',
        'variable.other.readwrite',
        'variable.other.local',
        'meta.definition.variable',
      ],
      settings: { foreground: '#abb2bf' },
    },
    // --- Parameters ---
    {
      scope: [
        'variable.parameter',
        'meta.parameter',
      ],
      settings: { foreground: '#d19a66' },
    },
    // --- this / self ---
    {
      scope: [
        'variable.language.this',
        'variable.language.self',
        'variable.language.special',
      ],
      settings: { foreground: '#e06c75', fontStyle: 'italic' },
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
      settings: { foreground: '#56b6c2' },
    },
    // --- Brackets, braces, parens ---
    {
      scope: [
        'punctuation.definition.block',
        'punctuation.definition.parameters',
        'punctuation.section',
        'meta.brace',
      ],
      settings: { foreground: '#abb2bf' },
    },
    // --- HTML/JSX tags ---
    {
      scope: [
        'entity.name.tag',
        'punctuation.definition.tag',
        'support.class.component',
      ],
      settings: { foreground: '#e06c75' },
    },
    // --- HTML/JSX attributes ---
    {
      scope: [
        'entity.other.attribute-name',
      ],
      settings: { foreground: '#d19a66' },
    },
    // --- Decorators ---
    {
      scope: [
        'meta.decorator',
        'punctuation.decorator',
        'meta.decorator entity.name.function',
      ],
      settings: { foreground: '#e5c07b' },
    },
    // --- Regex ---
    {
      scope: [
        'string.regexp',
        'keyword.other.regex',
      ],
      settings: { foreground: '#56b6c2' },
    },
    // --- Escape sequences ---
    {
      scope: [
        'constant.character.escape',
      ],
      settings: { foreground: '#56b6c2' },
    },
    // --- CSS selectors ---
    {
      scope: [
        'entity.other.attribute-name.class.css',
        'entity.other.attribute-name.id.css',
        'entity.name.tag.css',
      ],
      settings: { foreground: '#e06c75' },
    },
    // --- CSS property names ---
    {
      scope: [
        'support.type.property-name.css',
      ],
      settings: { foreground: '#abb2bf' },
    },
    // --- CSS values ---
    {
      scope: [
        'support.constant.property-value.css',
        'meta.property-value.css',
      ],
      settings: { foreground: '#d19a66' },
    },
    // --- CSS units & colors ---
    {
      scope: [
        'keyword.other.unit.css',
        'constant.other.color.rgb-value.hex.css',
        'punctuation.definition.constant.css',
      ],
      settings: { foreground: '#d19a66' },
    },
    // --- Markdown headings ---
    {
      scope: [
        'markup.heading',
        'entity.name.section',
      ],
      settings: { foreground: '#e06c75', fontStyle: 'bold' },
    },
    // --- Markdown bold ---
    {
      scope: ['markup.bold'],
      settings: { foreground: '#d19a66', fontStyle: 'bold' },
    },
    // --- Markdown italic ---
    {
      scope: ['markup.italic'],
      settings: { foreground: '#c678dd', fontStyle: 'italic' },
    },
    // --- Markdown links ---
    {
      scope: ['markup.underline.link'],
      settings: { foreground: '#61afef' },
    },
    // --- Markdown inline code ---
    {
      scope: ['markup.inline.raw'],
      settings: { foreground: '#98c379' },
    },
    // --- Error / Invalid ---
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: '#e06c75' },
    },
    // --- Python: builtins ---
    {
      scope: [
        'support.function.builtin.python',
        'support.type.python',
      ],
      settings: { foreground: '#61afef' },
    },
    // --- Python: magic methods ---
    {
      scope: [
        'support.function.magic.python',
      ],
      settings: { foreground: '#56b6c2', fontStyle: 'italic' },
    },
    // --- Rust: lifetimes ---
    {
      scope: ['storage.modifier.lifetime.rust'],
      settings: { foreground: '#d19a66', fontStyle: 'italic' },
    },
    // --- Shell: variables ---
    {
      scope: [
        'variable.other.normal.shell',
        'punctuation.definition.variable.shell',
      ],
      settings: { foreground: '#abb2bf' },
    },
    // --- YAML keys ---
    {
      scope: ['entity.name.tag.yaml'],
      settings: { foreground: '#e06c75' },
    },
    // --- TOML keys ---
    {
      scope: ['support.type.property-name.toml'],
      settings: { foreground: '#e06c75' },
    },
    // --- JSON string values ---
    {
      scope: ['string.quoted.double.json'],
      settings: { foreground: '#98c379' },
    },
    // --- Punctuation: string delimiters ---
    {
      scope: [
        'punctuation.definition.string',
      ],
      settings: { foreground: '#98c379' },
    },
  ],
}

export default defineShikiSetup(() => ({
  themes: {
    light: purpleUnicornTheme,
    dark: purpleUnicornTheme,
  },
}))
