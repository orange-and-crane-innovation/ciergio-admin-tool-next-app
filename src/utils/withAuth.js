import { initializeApollo } from '@app/lib/apollo/apolloClient'
import gql from 'graphql-tag'
import React from 'react'

const ME_QUERY = gql`
  query Authenticate {
    user {
      id
      firstName
      lastName
      fullName
    }
  }
`

export const withAuth = WrappedComponent => {
  return class Component extends React.Component {
    static async getInitialProps({ res }) {
      try {
        const apolloClient = await initializeApollo()
        const response = await apolloClient.query({
          query: ME_QUERY
        })

        return {
          me: response
        }
      } catch (error) {
        res.writeHead(301, {
          Location: '/auth/login'
        })
        res.end()

        return {}
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
