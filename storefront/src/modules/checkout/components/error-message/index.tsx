import styles from "./style.module.scss"

const ErrorMessage = ({ error, 'data-testid': dataTestid }: { error?: string | null, 'data-testid'?: string }) => {
  if (!error) {
    return null
  }

  return (
  <div className={styles.root} data-testid={dataTestid}>
      <span>{error}</span>
    </div>
  )
}

export default ErrorMessage
