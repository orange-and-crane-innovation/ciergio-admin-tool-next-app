import gql from 'graphql-tag'

export const GET_ACCOUNTS = gql`
  query getAccounts(
    $companyId: String
    $accountTypes: [String]
    $search: String
  ) {
    getAccounts(
      where: {
        companyId: $companyId
        accountTypes: $accountTypes
        search: $search
        status: "active"
      }
    ) {
      count
      skip
      limit
      data {
        _id
        accountType
        user {
          firstName
          lastName
          avatar
          jobTitle
        }
        company {
          name
        }
      }
    }
  }
`

export const GET_ROLES = gql`
  {
    getRoles {
      _id
      name
    }
  }
`

export const GET_COMPANIES = gql`
  {
    getCompanies(where: { status: "active" }) {
      data {
        _id
        name
      }
    }
  }
`
