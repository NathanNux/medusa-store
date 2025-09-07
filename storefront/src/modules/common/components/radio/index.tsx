import s from "./style.module.scss"

const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <div className={s.root}>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className={s.button}
        data-testid={dataTestId || 'radio-button'}
      >
        <div className={checked ? `${s.outer} ${s.checked}` : s.outer}>
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className={s.inner}
            >
              <div className={s.inner}></div>
            </span>
          )}
        </div>
      </button>
    </div>
  )
}

export default Radio
