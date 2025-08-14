import React from "react"

import { IconProps } from "types/icon"

const WheelIcon: React.FC<IconProps> = ({
  size = "51",
  color = "black",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 51 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M45.9792 14.7383H4.3125"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        opacity="0.5"
        d="M39.7292 24.7383H10.5625"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M33.4792 34.7383H16.8125"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default WheelIcon