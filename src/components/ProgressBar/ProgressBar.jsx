import { normalizarProgresso } from './normalizarProgresso.js'
import estilos from './ProgressBar.module.css'

/**
 * Barra de Progresso.
 *
 * Props:
 * - valor            : progresso de 0 a 100
 * - rotulo           : descrição da tarefa (ex.: "Enviando arquivo")
 * - mostrarPercentual: exibe o valor numérico ao lado do rótulo
 * - cor              : 'primaria' | 'sucesso' | 'erro'
 *
 * Componente sem estado: a largura do preenchimento deriva diretamente da prop `valor`.
 */
export default function ProgressBar({ valor = 0, rotulo = 'Progresso', mostrarPercentual = true, cor = 'primaria' }) {
  const progresso = normalizarProgresso(valor)
  const percentualArredondado = Math.round(progresso)
  const classeCor = estilos[cor] || estilos.primaria

  return (
    <div className={estilos.envoltorio}>
      <div className={estilos.cabecalho}>
        <span className={estilos.rotulo}>{rotulo}</span>
        {mostrarPercentual && (
          <span className={estilos.percentual} data-testid="percentual">
            {percentualArredondado}%
          </span>
        )}
      </div>
      <div
        className={estilos.trilha}
        role="progressbar"
        aria-label={rotulo}
        aria-valuenow={percentualArredondado}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${percentualArredondado}% concluído`}
      >
        <div
          className={`${estilos.preenchimento} ${classeCor}`}
          style={{ width: `${progresso}%` }}
          data-testid="preenchimento"
        />
      </div>
    </div>
  )
}
