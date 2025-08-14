import React from "react"

import { IconProps } from "types/icon"

const SearchIcon: React.FC<IconProps> = ({
  size = "21",
  color = "#747E62",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={Number(size) * 20 / 21}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M17.5002 18.0256L13.881 14.4064M13.881 14.4064C14.5001 13.7873 14.9912 13.0524 15.3262 12.2435C15.6612 11.4347 15.8337 10.5677 15.8337 9.69223C15.8337 8.81673 15.6612 7.9498 15.3262 7.14094C14.9912 6.33208 14.5001 5.59714 13.881 4.97806C13.2619 4.35899 12.527 3.86791 11.7181 3.53287C10.9093 3.19783 10.0423 3.02539 9.16684 3.02539C8.29134 3.02539 7.42441 3.19783 6.61555 3.53287C5.80669 3.86791 5.07174 4.35899 4.45267 4.97806C3.2024 6.22834 2.5 7.92407 2.5 9.69223C2.5 11.4604 3.2024 13.1561 4.45267 14.4064C5.70295 15.6567 7.39868 16.3591 9.16684 16.3591C10.935 16.3591 12.6307 15.6567 13.881 14.4064Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SearchIcon