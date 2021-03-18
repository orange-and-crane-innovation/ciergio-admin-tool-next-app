import gql from 'graphql-tag'

export const GET_ISSUES_BY_STATUS = gql`
  query getIssuesByStatus(
    $where: IssuesInput
    $limit: Int
    $offset: Int
    $search: String
  ) {
    getIssues(where: $where, limit: $limit, offset: $offset, search: $search) {
      count
      limit
      offset
      issue {
        _id
        title
        content
        code
        createdAt
        updatedAt
        readAt
        status
        category {
          _id
          name
          __typename
        }
        assignee {
          _id
          user {
            _id
            firstName
            lastName
            avatar
          }
          __typename
        }
        reporter {
          user {
            _id
            firstName
            lastName
            __typename
          }
          unit {
            _id
            name
            __typename
          }
          __typename
        }
        __typename
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query getCategories($where: AllowedPostCategoryInput) {
    getAllowedPostCategory(where: $where, limit: 500) {
      count
      limit
      offset
      data {
        _id
        accountId
        accountType
        categories {
          _id
          name
          status
          defaultImage
          type
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const GET_UNITS = gql`
  query getUnits($where: GetUnitsParams) {
    getUnits(where: $where) {
      count
      data {
        _id
        name
        floorNumber
        __typename
      }
      __typename
    }
  }
`

export const GET_STAFFS = gql`
  query getStaffs($where: GetRepairsAndMaintenanceStaffsParams) {
    getRepairsAndMaintenanceStaffs(where: $where) {
      data {
        _id
        accountType
        user {
          _id
          firstName
          lastName
          __typename
        }
        complex {
          _id
          __typename
        }
        building {
          _id
          __typename
        }
        __typename
      }
      __typename
    }
  }
`
