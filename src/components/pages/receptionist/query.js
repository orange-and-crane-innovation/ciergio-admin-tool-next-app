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

export const GET_REGISTRYRECORDS = gql`
  query getRegistryRecords(
    $limit: Int
    $offset: Int
    $sort: Int
    $sortBy: String
    $where: RegistryRecordsInput
  ) {
    getRegistryRecords(
      limit: $limit
      offset: $offset
      sort: $sort
      sortBy: $sortBy
      where: $where
    ) {
      building {
        complex {
          company {
            name
            _id
          }
          name
          _id
        }
        _id
        name
        __typename
      }

      category {
        _id
        name
        __typename
      }
      data {
        _id
        checkedInAt
        checkInSchedule
        checkedOutAt

        status
        forWho {
          _id
          accountType
          user {
            _id
            firstName
            lastName
          }
        }
        forWhat {
          building {
            complex {
              company {
                name
                _id
              }
              name
              _id
            }
            _id
            name
            __typename
          }
          name
          _id
          __typename
        }
        type {
          name
          _id
          __typename
        }
        visitor {
          firstName
          lastName
          company
          __typename
        }
        author {
          accountType
          user {
            _id
            firstName
            lastName
          }
        }
        building {
          name
          _id
          __typename
        }
        company {
          name
          _id
          __typename
        }
        building {
          name
          _id
          __typename
        }
        category {
          name
          _id
          __typename
        }
      }
      limit
      offset
      count
    }
  }
`
