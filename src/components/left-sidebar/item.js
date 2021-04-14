import React, { useState, useEffect } from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

const Item = ({ url, icon, title, items }) => {
  const [hidden, setHidden] = useState(true)
  const [sidebarItem, setSidebarItem] = useState(null)
  const router = useRouter()
  const { pathname } = { ...router }
  const active = pathname === url

  useEffect(() => {
    let parentUrl = ''
    if (items.length === 0) {
      setSidebarItem(
        <Link href={url}>
          <a className={`left-sidebar-item ${active ? 'active' : ''}`}>
            {icon && <i className={`icon ${icon}`}></i>}
            <span className="title">{title}</span>
          </a>
        </Link>
      )
    } else {
      parentUrl = url
      const splitPath = pathname.split('/')
      if (splitPath.length > 2) {
        if (`/${splitPath[1]}` === parentUrl) {
          setHidden(false)
        }
      }
    }
  }, [items, url, icon, items, pathname])

  return (
    <>
      {sidebarItem || (
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
      )}
    </>
  )
}
Item.propTypes = {
  url: P.string,
  icon: P.string,
  title: P.string,
  items: P.array
}

export default Item
