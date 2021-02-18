import React, { useState, useEffect } from 'react'
import P from 'prop-types'
import Head from 'next/head'
import HeaderNav from '@app/components/header-nav'
import LeftSidebar from '@app/components/left-sidebar'

import withAuth from '@app/utils/withAuth'

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE

const Layout = ({ children }) => {
  const [collapsed, setCollapse] = useState(false)
  const [userRole, setUserRole] = useState('')

  const profile = JSON.parse(localStorage.getItem('profile'))

  useEffect(() => {
    setUserRole(profile?.accounts?.data[0]?.accountType)
  }, [profile])

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
            userRole={userRole}
            systemType={systemType}
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
