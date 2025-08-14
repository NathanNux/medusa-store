import { HttpTypes } from "@medusajs/types"

import styles from "./select.module.scss"
import HashtagButton from "@modules/common/components/Buttons/hashtagButton"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  title: string
  disabled: boolean | undefined
  "data-testid"?: string
}


const OptionsSelect: React.FC<OptionSelectProps> = ({
    option,
    current,
    updateOption,
    title,
    "data-testid": dataTestId,
    disabled,
}) => {
    const filteredOptions = (option.values ?? []).map((v) => v.value)

    return (
        <div className={styles.Select}> 
            {filteredOptions.map((value) => {
                return (
                    <HashtagButton
                        key={value}
                        text={value}
                        isActive={current === value}
                        onClick={() => updateOption(option.id, value)}
                        disabled={disabled}
                        data-testid={dataTestId}
                    />
                )
            })}
        </div>
    )
}

export default OptionsSelect