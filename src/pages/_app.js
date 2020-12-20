// Styles
import '@app/styles/globals.css'
// import '@app/styles/temp-main-content.css'
// import '@app/styles/ciergio-icon.css'
// import '@app/styles/animate.css'
// import '@app/styles/components/buttons.css'

import '@app/styles/components/left-sidebar/styles-lg.css'
import '@app/styles/components/left-sidebar/styles-sm.css'
import '@app/styles/layouts/layout-1.css'

import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import P from 'prop-types'

import { useApollo } from '@app/lib/apollo/client'

import Layout from '@app/layouts'

if (process.env.NODE_ENV !== 'production') {
  require('@app/lib/msw')
}

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

MyApp.propTypes = {
  Component: P.any,
  pageProps: P.object.isRequired
}

export default MyApp
