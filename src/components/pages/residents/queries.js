import gql from 'graphql-tag'

export const GET_RESIDENT = gql`
  query getResident($where: GetAccountsParams) {
    getAccounts(where: $where) {
      count
      data {
        _id
        accountType
        user {
          _id
          firstName
          lastName
          avatar
          email
          __typename
        }
        company {
          _id
          name
          __typename
        }
        complex {
          _id
          name
          __typename
        }
        building {
          _id
          name
          __typename
        }
        unit {
          _id
          name
          __typename
        }
        __typename
      }
    }
  }
`

export const GET_RESIDENT_HISTORY = gql`
  query getResidentHistory($where: GetHistoryParams) {
    getAccountHistory(where: $where) {
      count
      data {
        date
        action
        data
        __typename
      }
      __typename
    }
  }
`
