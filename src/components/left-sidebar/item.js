import React, { useContext, useEffect, useState } from 'react'

import { Context } from '@app/lib/global/MsgContext/store'
import { FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'
import P from 'prop-types'
import { useRouter } from 'next/router'

const Item = ({ url, icon, title, items, badge }) => {
  const [state] = useContext(Context)
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
          <div className={`left-sidebar-item ${active ? 'active' : ''}`}>
            {icon && <i className={`icon ${icon}`}></i>}
            <span className="title">{title}</span>
            {badge && state[badge] > 0 && (
              <div className="badge">{state[badge]}</div>
            )}
          </div>
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
  }, [items, url, icon, items, pathname, badge, state])

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
  items: P.array,
  badge: P.string
}

export default Item
