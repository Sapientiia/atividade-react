import Toast from './Toast.jsx'
import estilos from './Toast.module.css'

/**
 * Área fixa no canto da tela onde os toasts são empilhados.
 * Fica sempre montada como região "ao vivo": leitores de tela só anunciam
 * conteúdo inserido em uma live region que já existia no DOM.
 * Recebe a lista via props (vinda do ToastProvider).
 */
export default function ToastContainer({ toasts = [], aoFechar }) {
  return (
    <section className={estilos.container} aria-label="Notificações" aria-live="polite" aria-relevant="additions text">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          duracao={toast.duracao}
          aoFechar={aoFechar}
        />
      ))}
    </section>
  )
}
