import { gql } from '@apollo/client'

export const GET_CATEGORIES = gql`
  query {
    getRegistryCategories(where: {}) {
      data {
        _id
        name
        status
        mark
      }
    }
  }
`
