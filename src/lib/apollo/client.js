import { useMemo } from 'react'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  concat,
  ApolloLink,
  split
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import merge from 'deepmerge'

let apolloClient

function createApolloClient() {
  const isBrowser = typeof window !== 'undefined'

  const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_API })

  const wsLink = process.browser
    ? new WebSocketLink({
        uri: process.env.NEXT_PUBLIC_SUBSCRIPTION_API,
        options: {
          reconnect: true,
          reconnectionAttempts: 10,
          timeout: 90000,
          connectionParams: () => {
            const token = (isBrowser && localStorage.getItem('keep')) || ''
            const user =
              (isBrowser && JSON.parse(localStorage.getItem('profile'))) || ''

            return {
              treat: isBrowser && navigator.userAgent,
              slave: token,
              userId: user?._id
            }
          },
          connectionCallback: error => {
            if (error) {
              console.log(
                '<===== AN ERROR ACCURED WHILE CONNECTING TO WEBSOCKET =====>'
              )
            } else {
              console.log('<===== WEBSOCKET CONNECTION SUCCESS =====>')
            }
          }
        }
      })
    : null

  const splitLink = process.browser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        httpLink
      )
    : httpLink

  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = (isBrowser && localStorage.getItem('keep')) || ''
    // add the authorization to the headers
    operation.setContext({
      headers: {
        treat: isBrowser && navigator.userAgent,
        spoil: new Date().getTime(),
        slave: token,
        device: 'web'
      }
    })

    return forward(operation)
  })

  return new ApolloClient({
    ssrMode: !isBrowser,
    link: concat(authMiddleware, splitLink),
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
