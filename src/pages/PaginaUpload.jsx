import { useEffect, useId, useState } from 'react'
import Icone from '../components/Icone/Icone.jsx'
import ProgressBar from '../components/ProgressBar/ProgressBar.jsx'
import { useToast } from '../context/ToastContext.js'
import estilos from './Paginas.module.css'

const INCREMENTO = 4
const INTERVALO_MS = 150
const ARQUIVO_PADRAO = { nome: 'comprovante-pedido-1042.pdf', tamanho: 184_320 }

function formatarTamanho(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Página de upload simulado: a Barra de Progresso recebe o valor via props e o estado vive aqui. */
export default function PaginaUpload() {
  const [progresso, setProgresso] = useState(0)
  const [enviando, setEnviando] = useState(false)
  const [arquivo, setArquivo] = useState(ARQUIVO_PADRAO)
  const { adicionarToast } = useToast()
  const idEntrada = useId()

  // Enquanto "enviando" for true, um intervalo incrementa o progresso até 100%.
  // O valor corrente fica na closure do efeito; o estado só é atualizado dentro
  // do callback do temporizador (sistema externo), nunca no corpo do efeito.
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

  function aoEscolherArquivo(evento) {
    // Só o nome e o tamanho são lidos, localmente. Nada é enviado.
    const selecionado = evento.target.files?.[0]
    if (!selecionado) return
    setArquivo({ nome: selecionado.name, tamanho: selecionado.size })
    setProgresso(0)
  }

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
      <div className={estilos.cabecalhoPagina}>
        <div>
          <span className="sobretitulo">
            <Icone nome="upload" tamanho={14} /> Documentos
          </span>
          <h1>Upload de comprovante</h1>
        </div>
      </div>
      <p className="texto-suave">Simulação de envio de arquivo. Nenhum dado sai do seu navegador.</p>

      <div className={estilos.uploadLayout}>
        <section className="cartao" aria-labelledby="titulo-upload">
          <h2 id="titulo-upload">Enviar arquivo</h2>

          <label htmlFor={idEntrada} className={estilos.zonaArquivo}>
            <span className={estilos.cartaoIcone}>
              <Icone nome="arquivo" tamanho={24} />
            </span>
            <span>
              <strong>{arquivo.nome}</strong>
              <span className="texto-fraco"> · {formatarTamanho(arquivo.tamanho)}</span>
            </span>
            <span className={estilos.zonaArquivoDica}>Clique para escolher outro arquivo</span>
            <input
              id={idEntrada}
              type="file"
              className="sr-only"
              onChange={aoEscolherArquivo}
              disabled={enviando}
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </label>

          <ProgressBar valor={progresso} rotulo={rotulo} cor={concluido ? 'sucesso' : 'primaria'} />

          <div className={estilos.grupoBotoes}>
            <button type="button" className="botao" onClick={iniciar} disabled={enviando}>
              <Icone nome="upload" tamanho={18} /> {concluido ? 'Enviar novamente' : 'Iniciar upload'}
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
      </div>
    </>
  )
}
