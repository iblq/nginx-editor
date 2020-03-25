import React from 'react'
import './style.less'

interface ComProps {
  className?: string
  children?: any
  right?: boolean
}

const createComponent = ({ className, right, ...rest }: ComProps, layoutClass: string) => {
  return <div {...rest} className={`${className} ${layoutClass}`} style={right ? { paddingRight: 8 } : {}} />
}

const Head = (p: ComProps) => createComponent(p, 'view-head')
const Right = (p: ComProps) => createComponent(p, 'view-right')
const Content = (p: ComProps) => createComponent(p, 'view-content')
const Layout = (p: ComProps) => createComponent(p, 'view-main')

export { Head, Right, Content, Layout }
