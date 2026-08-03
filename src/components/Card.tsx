import React from 'react'


type cardProps={
    children: React.ReactNode,
    style: React.CSSProperties
}

export const Card: React.FC<cardProps> = ({children, style}) => {
  return (
    <div style={style}>{children}</div>
  )
}
