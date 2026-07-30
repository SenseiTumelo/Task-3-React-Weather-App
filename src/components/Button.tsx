import type React from "react";

type btnProp = {
    style?: React.CSSProperties,
    children: React.ReactNode
}

export const Button: React.FC<btnProp> = ({style, children}) => {
  return (
    <button style={style}>{children}</button>
  )
}
