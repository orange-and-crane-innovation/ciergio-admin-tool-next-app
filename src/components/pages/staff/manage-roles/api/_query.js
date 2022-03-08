import { gql } from '@apollo/client'

const GET_ROLES = gql`
  query {
    getRoles {
      _id
      name
      permissions
    }
  }
`

const GET_ROLE = gql`
  query {
    role {
      _id
      name
      permissions
    }
  }
`

export { GET_ROLES, GET_ROLE }
