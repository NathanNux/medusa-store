import React from "react"

import { IconProps } from "types/icon"

const LogoutIcon: React.FC<IconProps> = ({
  size = "21",
  color = "#747E62",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      {...attributes}
    >
      <path
        d="M10 12H20M20 12L17 9M20 12L17 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4M12 20C10.8006 20.0007 9.61651 19.7314 8.53542 19.2121C7.45434 18.6928 6.50404 17.9367 5.755 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default LogoutIcon
