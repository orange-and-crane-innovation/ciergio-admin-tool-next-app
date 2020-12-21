import React, { useState } from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

const Item = ({ url, icon, title, items }) => {
  const [hidden, setHidden] = useState(true)
  const router = useRouter()
  const { pathname } = { ...router }
  let active = pathname === url

  if (pathname === '/' && url === '/dashboard') {
    active = true
  }
  if (pathname === '/' && url !== '/dashboard') {
    active = false
  }
  if (items.length === 0) {
    return (
      <Link href={url}>
        <a className={`left-sidebar-item ${active ? 'active' : ''}`}>
          {icon && <i className={`icon ${icon}`}></i>}
          <span className="title">{title}</span>
        </a>
      </Link>
    )
  }
  return (
    <button
      onClick={() => setHidden(!hidden)}
      className={`left-sidebar-item ${active ? 'active' : ''} ${
        hidden ? 'hidden-sibling' : 'open-sibling'
      }`}
    >
      {icon && <i className={`icon ${icon}`}></i>}
      <span className="title">{title}</span>
      <FiChevronRight className="ml-auto arrow" />
    </button>
  )
}
Item.propTypes = {
  url: P.string,
  icon: P.string,
  title: P.string,
  items: P.array
}

export default Item
