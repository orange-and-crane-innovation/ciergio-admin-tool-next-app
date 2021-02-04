import React, { useState, useEffect } from 'react'
import P from 'prop-types'
import Head from 'next/head'
import HeaderNav from '@app/components/header-nav'
import LeftSidebar from '@app/components/left-sidebar'

// TODO: Update with proper navigtion coming from state/props
import {
  circleNavigation,
  homeNavigation,
  prayNavigation
} from '@app/components/left-sidebar/dummy-nav'
import withAuth from '@app/utils/withAuth'

const getNavigation = type => {
  switch (type) {
    case 'pray':
      return prayNavigation
    case 'circle':
      return circleNavigation
    default:
      return homeNavigation
  }
}
const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
const navigation = getNavigation(systemType)

const Layout = ({ children }) => {
  const [collapsed, setCollapse] = useState(false)

  useEffect(() => {
    setCollapse(collapsed)
  }, [collapsed])

  const handleCollapse = isCollapsed => {
    setCollapse(isCollapsed)
  }

  return (
    <>
      <Head>
        <title>Ciergio</title>
      </Head>
      <div
        data-layout={'layout-1'}
        data-collapsed={collapsed}
        data-background={'light'}
        data-navbar={'light'}
        data-left-sidebar={'light'}
        className={`font-sans antialiased text-sm disable-scrollbars default-mode`}
      >
        <div className="wrapper">
          <LeftSidebar
            navigation={navigation}
            onToggle={handleCollapse}
            isCollapsed={collapsed}
          />
          <div className="main w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <HeaderNav onToggle={handleCollapse} isCollapsed={collapsed} />
            <div className="min-h-screen w-full p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: P.node
}

export default withAuth(Layout)
