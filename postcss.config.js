import tailwind from 'tailwindcss'
import tailwind_conf from './tailwind.config.js'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwind(tailwind_conf),
    autoprefixer
  ]
}
