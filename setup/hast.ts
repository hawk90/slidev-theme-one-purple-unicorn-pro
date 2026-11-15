// HAST node types for the Shiki transformers (cuda-transformer.ts,
// terminal-transformer.ts), taken from Shiki's own hook signatures, so no
// extra dependency; and the text of a node.

import type { ShikiTransformer } from 'shiki'

export type Element = Parameters<NonNullable<ShikiTransformer['span']>>[0]
export type Content = Element['children'][number]
export type Root = Parameters<NonNullable<ShikiTransformer['root']>>[0]
export type Node = Root | Root['children'][number]

/** The text inside a node, its children's joined */
export const textOf = (node: Node | Content): string =>
  node.type === 'text' ? node.value : 'children' in node ? node.children.map(textOf).join('') : ''
