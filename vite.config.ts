import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE_PATH to the repo name (e.g. "/WorldCupBracket/") when deploying
// to project Pages. Defaults to "/" for local dev and custom-domain Pages.
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
})
