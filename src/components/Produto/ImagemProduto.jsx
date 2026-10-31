import Icone from '../Icone/Icone.jsx'
import { ESTILO_CATEGORIA } from '../../data/produtos.js'
import estilos from './Produto.module.css'

/**
 * "Foto" ilustrativa do produto: ícone da categoria sobre fundo cinza claro, sem arquivos externos.
 * Use `decorativa` quando a imagem estiver dentro de um link ou cartão que já nomeia o produto.
 */
export default function ImagemProduto({ produto, tamanhoIcone = 56, className = '', decorativa = false }) {
  const estilo = ESTILO_CATEGORIA[produto.categoria] ?? ESTILO_CATEGORIA.Casa
  const atributosAcessiveis = decorativa
    ? { 'aria-hidden': 'true' }
    : { role: 'img', 'aria-label': `Ilustração de ${produto.nome}` }

  return (
    <div className={`${estilos.imagem} ${className}`} style={{ color: estilo.cor }} {...atributosAcessiveis}>
      <Icone nome={estilo.icone} tamanho={tamanhoIcone} espessura={1.25} />
    </div>
  )
}
