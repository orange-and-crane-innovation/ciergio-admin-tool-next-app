import { useMemo } from 'react'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  concat,
  ApolloLink
} from '@apollo/client'
import merge from 'deepmerge'

let apolloClient

function createApolloClient() {
  const isBrowser = typeof window !== 'undefined'

  const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' })

  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = (isBrowser && localStorage.getItem('token')) || ''
    // add the authorization to the headers
    operation.setContext({
      headers: {
        treat: isBrowser && navigator.userAgent,
        spoil: new Date().getTime(),
        slave: token
      }
    })

    return forward(operation)
  })

  return new ApolloClient({
    ssrMode: !isBrowser,
    link: concat(authMiddleware, httpLink),
    credentials: 'same-origin',
    cache: new InMemoryCache()
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache)

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
