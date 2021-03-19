import gql from 'graphql-tag'

export const GET_COMPLEXES = gql`
  query getComplexes($where: GetComplexesParams) {
    getComplexes(where: $where, limit: 50, skip: 0) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }
`

export const GET_BUILDINGS = gql`
  query getBuildings($where: GetBuildingsParams) {
    getBuildings(where: $where, limit: 50, skip: 0) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }
`

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

export const GET_RESIDENTS = gql`
  query getResidents($where: GetAccountsParams) {
    getAccounts(where: $where, limit: 100, skip: 0) {
      count
      skip
      limit
      data {
        _id
        accountType
        user {
          _id
          firstName
          lastName
          __typename
        }
        __typename
      }
    }
  }
`

export const CREATE_ISSUE = gql`
  mutation createTicket($data: InputCreateIssue) {
    createIssue(data: $data) {
      _id
      message
      processId
      __typename
    }
  }
`

export const GET_ISSUE_DETAILS = gql`
  query getIssueDetails($id: String) {
    getIssue(id: $id) {
      issue {
        _id
        createdAt
        readAt
        is_follower
        title
        content
        status
        code
        category {
          _id
          name
          __typename
        }
        mediaAttachments {
          _id
          url
          type
          __typename
        }
        author {
          _id
          accountType
          user {
            _id
            firstName
            lastName
            __typename
          }
          __typename
        }
        reporter {
          _id
          accountType
          user {
            _id
            firstName
            lastName
            __typename
          }
          __typename
        }
        assignee {
          _id
          accountType
          user {
            _id
            avatar
            firstName
            lastName
            __typename
          }
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
      __typename
    }
  }
`

export const GET_ISSUE_COMMENTS = gql`
  query getIssueComments($id: String) {
    getIssue(id: $id) {
      issue {
        _id
        comments(limit: 100, offset: 0, sort: -1) {
          count
          limit
          offset
          data {
            _id
            comment
            mediaAttachments {
              _id
              url
              type
              __typename
            }
            user {
              _id
              avatar
              firstName
              lastName
              __typename
            }
            createdAt
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const POST_ISSUE_COMMENT = gql`
  mutation postIssueComment($data: CommentInput) {
    comment(data: $data) {
      _id
      message
      processId
      __typename
    }
  }
`
