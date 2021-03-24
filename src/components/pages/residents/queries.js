import gql from 'graphql-tag'

export const GET_RESIDENTS = gql`
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

export const GET_FLOOR_NUMBERS = gql`
  query getFloorNumbers($buildingId: String) {
    getFloorNumbers(buildingId: $buildingId)
  }
`

export const GET_INVITES_AND_REQUESTS = gql`
  query($where: GetExtensionAccountRequestsParams, $limit: Int, $skip: Int) {
    getExtensionAccountRequests(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        __typename
        firstName
        lastName
        email
        createdAt
        accountType
        unit {
          _id
          name
          __typename
        }
      }
      __typename
    }
  }
`
