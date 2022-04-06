// Styles
import '@app/styles/globals.css'
import '@app/styles/temp-main-content.css'
import '@app/styles/ciergio-icon.css'
import '@app/styles/animate.css'
import '@app/styles/components/buttons.css'
import '@app/styles/components/dropdowns.css'
import '@app/styles/components/left-sidebar/styles-lg.css'
import '@app/styles/components/left-sidebar/styles-sm.css'
import '@app/styles/components/header-nav/navbar.css'
import '@app/styles/layouts/layout-1.css'

import { ApolloProvider } from '@apollo/client'
import { FaSpinner } from 'react-icons/fa'
import Head from 'next/head'
import Layout from '@app/layouts'
import P from 'prop-types'
import Roles from '@app/lib/global/RolesAndPermissionsContext/store'
import Store from '@app/lib/global/MsgContext/store'
import closeToast from '@app/utils/closeToast'
import showToast from '@app/utils/toast'
import { useApollo } from '@app/lib/apollo/client'
import { useEffect } from 'react'

if (process.env.NODE_ENV !== 'production') {
  require('@app/lib/msw')
}

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  useEffect(() => {
    window.addEventListener('offline', updateOnlineStatus)
    window.addEventListener('online', updateOnlineStatus)
  }, [])

  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine
    const bodyTag = document.getElementsByTagName('body')

    if (isOnline) {
      bodyTag[0].classList.remove('disconnected')
      closeToast()
      showToast('success', 'Reconnected', 'bottom-right')
    } else {
      bodyTag[0].classList.add('disconnected')
      showToast(
        'danger',
        'Your computer seems to be offline. We’ll keep trying to reconnect, please check your internet connection.',
        'bottom-right',
        <FaSpinner className="icon-spin" />,
        null
      )
    }
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Store>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Store>
    </ApolloProvider>
  )
}

MyApp.propTypes = {
  Component: P.any,
  pageProps: P.object.isRequired
}

export default MyApp
