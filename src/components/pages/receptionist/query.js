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
        notesCount
        status
        forWho {
          _id
          accountType
          conversations {
            count
            data {
              _id
            }
          }
          user {
            _id
            firstName
            lastName
          }
          unit {
            name
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

export const GET_REGISTRYRECORD = gql`
  query getRegistryRecord($recordId: String) {
    getRegistryRecord(recordId: $recordId) {
      _id
      createdAt
      updatedAt
      checkedInAt
      checkInSchedule
      checkedOutAt
      mediaAttachments {
        url
        type
      }
      notes {
        data {
          _id
          author {
            user {
              firstName
              lastName
            }
          }
          content
          createdAt
          updatedAt
        }
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
          avatar
          coverPhoto
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
      forWho {
        _id
        accountType
        user {
          _id
          firstName
          lastName
        }
        unit {
          name
        }
      }
    }
  }
`
export const GET_UNITS = gql`
  query getUnits($where: GetUnitsParams) {
    getUnits(where: $where) {
      data {
        _id
        name
        building {
          name
          __typename
          _id
        }
        unitOwner {
          _id
          accountType
          __typename
          _id
          user {
            firstName
            email
            lastName
            _id
            __typename
          }
        }
      }
    }
  }
`
