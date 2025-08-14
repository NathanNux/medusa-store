import React from "react"

import { IconProps } from "types/icon"

const Close: React.FC<IconProps> = ({
  size = "12",
  color = "#05050A",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M0.710938 10.6367L10.7109 0.636719M10.7109 10.6367L0.710938 0.636719"
        stroke={color}
        strokeOpacity="0.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}