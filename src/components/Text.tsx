import React from 'react'


type textProps = {
    style?: React.CSSProperties,
    children: React.ReactNode,
    variant?: string
}

export const Text: React.FC<textProps> = ({style, children, variant}) => {
  
    if(variant==='h1') return <h1 style={style}>{children}</h1>
    if(variant==='h2') return <h2 style={style}>{children}</h2>
    if(variant==='h3') return <h3 style={style}>{children}</h3>
    if(variant==='p') return <p style={style}>{children}</p>
  
  
    return (
    <div style={style}>{children}</div>
  )
}

