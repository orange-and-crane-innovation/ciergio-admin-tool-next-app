import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import merge from 'deepmerge'
import crossFetch, { fetch } from 'cross-fetch'
import { useMemo } from 'react'
import process from 'process'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
export const isBrowser = typeof window !== 'undefined'

let apolloClient

export const accountMutationClient = createApolloClient()

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API,
      credentials: 'same-origin',
      fetch: isBrowser ? (...args) => fetch(...args) : crossFetch,
      headers: {
        'Content-Type': 'application/json',
        treat: isBrowser && navigator.userAgent,
        spoil: new Date().getTime(),
        slave: ''
      }
    }),
    cache: new InMemoryCache()
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()
  if (initialState) {
    const existingCache = _apolloClient.extract()
    const data = merge(initialState, existingCache)
    _apolloClient.cache.restore(data)
  }

  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}
