import React from 'react'
import withAuth from '@app/utils/withAuth'
import Head from 'next/head'
// import Navbar1 from '../../components/navbar-1'
import LeftSidebar from '@app/components/left-sidebar'

// TODO: Update with proper navigtion coming from state/props
import navigation from '@app/components/left-sidebar/dummy-nav'
import withGuest from '@app/utils/withGuest'

const Layout = ({children}) => {

  return (
    <>
      <Head>
        <title>Ciergio</title>
      </Head>
      <div
        data-layout={"layout-1"}
        data-collapsed={"false"}
        data-background={"light"}
        data-navbar={"light"}
        data-left-sidebar={"light"}
        className={`font-sans antialiased text-sm disable-scrollbars default-mode`}>
        <div className="wrapper">
          <LeftSidebar navigation={navigation} />
          <div className="main w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            {/* <Navbar1 /> */}
            <div className="min-h-screen w-full p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}
export default withGuest(Layout)
