<template>
  <!-- An Apache ECharts chart in the theme's colors (series palette, text,
       grid lines), for what the SVG <Chart> doesn't draw. ECharts is an
       optional peer dependency: `npm i -D echarts` in a deck that uses this
       (Slidev only loads the components a deck uses, so others don't need it).
       Drawn as SVG (sharp in exports, no animation there); it plays again
       each time the slide is shown. -->
  <div ref="root" class="echart" :style="{ height }">
    <div v-if="missing" class="echart-missing">Install <code>echarts</code> in the deck to draw this chart.</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SERIES_COLORS } from '../utils/chart'
import { isPrintMode } from '../utils/print-mode'
import { onSlideArrival } from '../utils/slide-motion'

const props = defineProps({
  /** An ECharts option object */
  option: { type: Object, required: true },
  height: { type: String, default: '18rem' },
})

const root = ref<HTMLElement>()
const missing = ref(false)
let chart: any = null

/** The theme's colors, read where the chart is (light mode, a dark slide) */
function palette(el: HTMLElement) {
  const cs = getComputedStyle(el)
  const read = (v: string) => {
    const name = /var\((--[\w-]+)\)/.exec(v)?.[1]
    return (name && cs.getPropertyValue(name).trim()) || v
  }
  return {
    color: SERIES_COLORS.map(read),
    text: cs.getPropertyValue('--text-secondary').trim() || '#a9b1d6',
    line: cs.getPropertyValue('--border-default').trim() || 'rgba(171,178,191,0.2)',
    font: cs.fontFamily,
  }
}

async function draw() {
  if (!root.value) return
  let echarts: any
  try {
    echarts = await import('echarts')
  }
  catch {
    missing.value = true
    return
  }
  const p = palette(root.value)
  chart?.dispose()
  chart = echarts.init(root.value, null, { renderer: 'svg' })
  // axes get the theme's lines and labels only where the option has them
  // (a pie has none)
  const axis = { axisLine: { lineStyle: { color: p.line } }, splitLine: { lineStyle: { color: p.line } }, axisLabel: { color: p.text } }
  const styled = (a: unknown) => (Array.isArray(a) ? a.map(x => ({ ...axis, ...x })) : a ? { ...axis, ...(a as object) } : undefined)
  const option: Record<string, unknown> = { ...props.option }
  for (const k of ['xAxis', 'yAxis']) if (option[k]) option[k] = styled(option[k])
  // series labels (a pie's) in the theme's text, without an outline: ECharts 6
  // draws them #333 with a white text border, which the global textStyle
  // doesn't reach; labels inside a shape keep ECharts' own contrast
  const plain = (s: any) => {
    const inside = /inside|center/i.test(String(s?.label?.position ?? ''))
    return { ...s, label: { ...(inside ? {} : { color: p.text }), textBorderWidth: 0, textBorderColor: 'transparent', textShadowBlur: 0, ...s?.label } }
  }
  if (option.series) option.series = Array.isArray(option.series) ? option.series.map(plain) : plain(option.series)
  chart.setOption({
    color: p.color,
    textStyle: { color: p.text, fontFamily: p.font, textBorderWidth: 0 },
    legend: { textStyle: { color: p.text } },
    animation: !isPrintMode(),
    ...option,
  })
}

onMounted(draw)
// again on each visit, so the animation plays where it is seen
onSlideArrival(root, () => {}, () => draw())
watch(() => props.option, draw, { deep: true })
onBeforeUnmount(() => chart?.dispose())
</script>

<style scoped>
.echart {
  width: 100%;
  margin: 0.75rem 0;
}

.echart-missing {
  display: grid;
  place-items: center;
  height: 100%;
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: 0.85rem;
}
</style>
