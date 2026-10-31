import { useEffect, useState } from 'react'
import ProgressBar from '../components/ProgressBar/ProgressBar.jsx'
import { useToast } from '../context/ToastContext.js'
import estilos from './Paginas.module.css'

const INCREMENTO = 4
const INTERVALO_MS = 150

/** Página de upload simulado: a Barra de Progresso recebe o valor via props e o estado vive aqui. */
export default function PaginaUpload() {
  const [progresso, setProgresso] = useState(0)
  const [enviando, setEnviando] = useState(false)
  const { adicionarToast } = useToast()

  // Enquanto "enviando" for true, um intervalo incrementa o progresso até 100%.
  // O valor corrente fica na closure do efeito; o estado só é atualizado dentro
  // do callback do temporizador (sistema externo), nunca no corpo do efeito.
  // A função de limpeza cancela o intervalo ao cancelar ou sair da página.
  useEffect(() => {
    if (!enviando) return undefined

    let valor = 0
    const intervalo = setInterval(() => {
      valor = Math.min(100, valor + INCREMENTO)
      setProgresso(valor)
      if (valor >= 100) {
        clearInterval(intervalo)
        setEnviando(false)
        adicionarToast({ tipo: 'sucesso', mensagem: 'Upload concluído com sucesso!' })
      }
    }, INTERVALO_MS)

    return () => clearInterval(intervalo)
  }, [enviando, adicionarToast])

  function iniciar() {
    setProgresso(0)
    setEnviando(true)
  }

  function cancelar() {
    setEnviando(false)
    setProgresso(0)
    adicionarToast({ tipo: 'erro', mensagem: 'Upload cancelado pelo usuário.' })
  }

  const concluido = !enviando && progresso === 100
  let rotulo = 'Aguardando envio'
  if (enviando) rotulo = 'Enviando arquivo'
  else if (concluido) rotulo = 'Envio concluído'

  return (
    <>
      <h1>Upload de comprovante</h1>
      <p className="texto-suave">Simulação de envio de arquivo. Nenhum dado é enviado de verdade.</p>

      <section className="cartao" aria-labelledby="titulo-upload">
        <h2 id="titulo-upload">comprovante-pedido-1042.pdf</h2>
        <ProgressBar valor={progresso} rotulo={rotulo} cor={concluido ? 'sucesso' : 'primaria'} />
        <div className={estilos.grupoBotoes}>
          <button type="button" className="botao" onClick={iniciar} disabled={enviando}>
            {concluido ? 'Enviar novamente' : 'Iniciar upload'}
          </button>
          <button type="button" className="botao botao--secundario" onClick={cancelar} disabled={!enviando}>
            Cancelar
          </button>
        </div>
      </section>

      <section className="cartao" aria-labelledby="titulo-outros">
        <h2 id="titulo-outros">Outros indicadores</h2>
        <p className="texto-suave">O mesmo componente com valores fixos recebidos por props.</p>
        <div className={estilos.listaProgresso}>
          <ProgressBar valor={25} rotulo="Cadastro completo" />
          <ProgressBar valor={70} rotulo="Meta de compras do mês" cor="sucesso" />
          <ProgressBar valor={92} rotulo="Espaço de armazenamento" cor="erro" />
        </div>
      </section>
    </>
  )
}
