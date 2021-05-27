import { useMemo } from 'react'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  concat,
  ApolloLink
} from '@apollo/client'
import merge from 'deepmerge'
import { SubscriptionClient } from 'subscriptions-transport-ws'

let apolloClient

function createApolloClient() {
  const isBrowser = typeof window !== 'undefined'

  const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_API })

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

export class Subscribe {
  constructor() {
    this.reconCount = 5
  }

  getClient() {
    return this.client
  }

  connect() {
    this.subscriptionLink = this.wsClient()
    this.client = this.subscriptionsClient(this.subscriptionLink)
  }

  wsClient() {
    const isBrowser = typeof window !== 'undefined'
    const token = (isBrowser && localStorage.getItem('keep')) || ''
    const user =
      (isBrowser && JSON.parse(localStorage.getItem('profile'))) || ''

    return new SubscriptionClient(process.env.NEXT_PUBLIC_SUBSCRIPTION_API, {
      timeout: 90000,
      reconnect: true,
      connectionParams: {
        treat: isBrowser && navigator.userAgent,
        slave: token,
        userId: user?._id
      },
      connectionCallback: error => {
        if (error) {
          console.log(
            '<===== AN ERROR ACCURED WHILE CONNECTING TO WEBSOCKET =====>'
          )
          const { message } = error
          if (message === 'Unauhorized') {
            if (this.reconCount > 0) {
              this.reconCount--
              this.subscriptionLink.reconnect()
            } else {
              this.subscriptionLink.close()
            }
          } else if (message === 'Invalid session') {
            if (this.reconCount > 0) {
              this.reconCount--
              this.subscriptionLink.reconnect()
            } else {
              this.subscriptionLink.close()
            }
          }
        } else {
          console.log('<===== WEBSOCKET CONNECTION SUCCESS =====>')
        }
      }
    })
  }

  subscriptionsClient(client) {
    const isBrowser = typeof window !== 'undefined'
    return new ApolloClient({
      ssrMode: !isBrowser,
      link: client,
      credentials: 'same-origin',
      cache: new InMemoryCache()
    })
  }
}
