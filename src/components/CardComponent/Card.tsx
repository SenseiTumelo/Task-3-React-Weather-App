import React from 'react'
import './Card.css'

type cardProps={
    children: React.ReactNode,
    style?: React.CSSProperties,
    className?: string
}

export const Card: React.FC<cardProps> = ({children, style}) => {
  return (
    <div style={style} className="main-card">{children}</div>
  )
}
