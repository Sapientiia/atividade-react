import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// O jsdom não implementa rolagem; o Layout chama scrollTo a cada troca de rota.
window.scrollTo = () => {}

// Desmonta a árvore React após cada teste. Sem "globals: true" no Vitest,
// a Testing Library não consegue registrar esse cleanup sozinha.
afterEach(() => {
  cleanup()
})
