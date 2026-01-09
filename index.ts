import { defineTheme } from '@slidev/types'

export default defineTheme({
  name: 'slidev-theme-one-purple-unicorn-pro',
  colorSchema: 'both',  // Support both light and dark themes
  highlighter: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    }
  },
  fonts: {
    sans: ['Noto Sans KR', 'Inter', 'system-ui', 'sans-serif'],
    serif: ['Noto Serif KR', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace']
  }
})