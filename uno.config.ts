import { defineConfig, presetUno, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  shortcuts: {
    'bg-main': 'bg-white text-[#4b5563] dark:(bg-[#1a1b26] text-[#a9b1d6])',
    'gradient-text': 'bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text',
  },
  theme: {
    colors: {
      primary: {
        purple: '#8b5cf6',
        indigo: '#6366f1',
        violet: '#a78bfa',
        pink: '#ec4899',
      }
    }
  },
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      fonts: {
        sans: 'Noto Sans KR',
        mono: 'JetBrains Mono'
      }
    })
  ]
})