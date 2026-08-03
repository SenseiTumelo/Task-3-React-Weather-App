import type React from "react";
import styles from "./Button.module.css"

type btnProp = {
    style?: React.CSSProperties,
    children: React.ReactNode,
    className?: string
}

export const Button: React.FC<btnProp> = ({style, children}) => {
  return (
    <button style={style} className={styles['button']}>{children}</button>
  )
}
