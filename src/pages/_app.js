import '@app/styles/globals.css'
import '@app/styles/temp-main-content.css'

import { ApolloProvider } from '@apollo/client'
import P from 'prop-types'

import { useApollo } from '@app/lib/apollo/client'

if (process.env.NODE_ENV !== 'production') {
  require('@app/lib/msw')
}

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

MyApp.propTypes = {
  Component: P.any,
  pageProps: P.object.isRequired
}

export default MyApp
