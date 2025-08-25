import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"
import styles from "./style.module.scss"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className={styles.root}>
      <Text className={styles.title}>{title}</Text>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange} className={styles.radioGroup}>
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx(styles.itemRow, {
              [styles.active]: i.value === value,
            })}
          >
            {i.value === value && <EllipseMiniSolid className={styles.icon} />}
            <RadioGroup.Item
              checked={i.value === value}
              className={styles.radio}
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(styles.label, {
                [styles.active]: i.value === value,
              })}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
