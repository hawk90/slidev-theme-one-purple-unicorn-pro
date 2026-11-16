import { defineMermaidSetup } from '@slidev/types'

// Mermaid in the theme's colors. Slidev renders with Mermaid's own `dark`
// theme in dark mode and its `default` in light, so the colors don't come from
// themeVariables: they come from `themeCSS`, rules Mermaid puts inside each
// diagram's SVG, written with the theme's CSS variables. The SVG sits in the
// slide, so the variables resolve there: light or dark mode, a dark layout
// (slide-dark) or a themeConfig palette, without drawing the diagram again.
// Variables (on :root or a slide): --mermaid-node-bg, --mermaid-node-border,
// --mermaid-text, --mermaid-line, --mermaid-cluster-bg, --mermaid-note-bg.
const node = 'var(--mermaid-node-bg, color-mix(in srgb, var(--primary-400) 16%, var(--slide-bg, #282c34)))'
const border = 'var(--mermaid-node-border, var(--primary-400))'
const text = 'var(--mermaid-text, var(--text-primary))'
const line = 'var(--mermaid-line, var(--text-secondary))'
const cluster = 'var(--mermaid-cluster-bg, color-mix(in srgb, var(--secondary-400) 8%, transparent))'
const note = 'var(--mermaid-note-bg, color-mix(in srgb, var(--one-dark-yellow) 18%, var(--slide-bg, #282c34)))'

export const mermaidThemeCSS = `
.node rect, .node circle, .node ellipse, .node polygon, .node path,
.basic.label-container, rect.actor, .classGroup rect, .stateGroup rect, rect.er.entityBox {
  fill: ${node} !important; stroke: ${border} !important;
}
.nodeLabel, .label, .label foreignObject div, .edgeLabel, .cluster-label, text.actor, .messageText,
.classTitle, .stateLabel text, .er.entityLabel, text.loopText, text.noteText {
  color: ${text} !important; fill: ${text} !important;
}
.edgePath .path, .flowchart-link, .messageLine0, .messageLine1, .relation, .transition, .er.relationshipLine,
line.actor-line, .loopLine {
  stroke: ${line} !important;
}
.arrowheadPath, marker path, #arrowhead path, .marker {
  fill: ${line} !important; stroke: ${line} !important;
}
.edgeLabel, .edgeLabel p, .edgeLabel span, .labelBkg {
  background-color: transparent !important;
}
.edgeLabel rect {
  fill: transparent !important;
}
.cluster rect {
  fill: ${cluster} !important; stroke: ${line} !important; stroke-dasharray: 4 3;
}
.note, rect.note {
  fill: ${note} !important; stroke: var(--one-dark-yellow) !important;
}
`

export default defineMermaidSetup(() => ({
  fontFamily: 'inherit',
  // the classic layered look, stable between Mermaid versions
  layout: 'dagre',
  themeCSS: mermaidThemeCSS,
}))
