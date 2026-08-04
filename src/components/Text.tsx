import React from 'react'


type textProps = {
    style?: React.CSSProperties,
    children: React.ReactNode,
    variant?: string,
    className?: string
}

export const Text: React.FC<textProps> = ({style, children, variant, className}) => {
  
    if(variant==='h1') return <h1 style={style} className={className}>{children}</h1>
    if(variant==='h2') return <h2 style={style} className={className}>{children}</h2>
    if(variant==='h3') return <h3 style={style} className={className}>{children}</h3>
    if(variant==='p') return <p style={style} className={className}>{children}</p>
  
  
    return (
    <div style={style} className={className}>{children}</div>
  )
}

