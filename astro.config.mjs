import { defineConfig } from 'astro/config';
import tina from '@tinacms/astro/integration';

// Configurazione per Sito Statico Puro adatto a Vercel e TinaCMS
export default defineConfig({
  output: 'static', // <-- Cambiato da 'server' a 'static'
  integrations: [tina()]
});
