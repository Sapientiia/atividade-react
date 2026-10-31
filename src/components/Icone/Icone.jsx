/**
 * Ícones SVG inline (traço, 24x24), sem biblioteca externa.
 * Uso: <Icone nome="carrinho" tamanho={20} />
 * Por padrão o ícone é decorativo (aria-hidden). Passe `rotulo` para torná-lo informativo.
 */
const circulo = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`

const CAMINHOS = {
  casa: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  pergunta: [circulo(12, 12, 10), 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01'],
  caixa: [
    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    'M3.27 6.96L12 12.01l8.73-5.05',
    'M12 22.08V12',
  ],
  usuario: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', circulo(12, 7, 4)],
  upload: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  carrinho: [circulo(9, 21, 1), circulo(20, 21, 1), 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'],
  sol: [circulo(12, 12, 5), 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'],
  lua: ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  monitor: ['M2 3h20v14H2z', 'M8 21h8', 'M12 17v4'],
  check: ['M20 6L9 17l-5-5'],
  x: ['M18 6L6 18', 'M6 6l12 12'],
  info: [circulo(12, 12, 10), 'M12 16v-4', 'M12 8h.01'],
  alerta: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  setaBaixo: ['M6 9l6 6 6-6'],
  setaDireita: ['M9 18l6-6-6-6'],
  setaEsquerda: ['M15 18l-6-6 6-6'],
  estrela: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  lixeira: ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  caminhao: ['M1 3h15v13H1z', 'M16 8h4l3 3v5h-7V8z', circulo(5.5, 18.5, 2.5), circulo(18.5, 18.5, 2.5)],
  escudo: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  cartao: ['M1 4h22v16H1z', 'M1 10h22'],
  mais: ['M12 5v14', 'M5 12h14'],
  menos: ['M5 12h14'],
  arquivo: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'],
  filtro: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  camadas: ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  atividade: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  lista: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  sino: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  raio: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  etiqueta: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
  livro: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
  fone: ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'],
  lampada: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z'],
  halter: ['M6 5v14', 'M18 5v14', 'M2 8v8', 'M22 8v8', 'M6 12h12'],
  olho: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', circulo(12, 12, 3)],
  mapa: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', circulo(12, 10, 3)],
  relogio: [circulo(12, 12, 10), 'M12 6v6l4 2'],
}

export default function Icone({ nome, tamanho = 20, rotulo, className = '', espessura = 2 }) {
  const caminhos = CAMINHOS[nome] ?? CAMINHOS.info
  return (
    <svg
      className={className}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={espessura}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={rotulo ? undefined : 'true'}
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo}
      focusable="false"
    >
      {caminhos.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
