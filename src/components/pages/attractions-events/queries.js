import gql from 'graphql-tag'

export const GET_ATTRACTIONS_CATEGORIES = gql`
  query getAttractionsCategories(
    $where: PostCategoryInput
    $limit: Int
    $offset: Int
  ) {
    getPostCategory(where: $where, limit: $limit, offset: $offset) {
      count
      limit
      offset
      category {
        _id
        name
        status
        defaultImage
        subcategory {
          name
          __typename
        }
        company {
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

export const GET_COMPANIES = gql`
  query getAttractionsCompanies($where: GetCompaniesParams) {
    getCompanies(where: $where) {
      count
      limit
      skip
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }
`

export const CREATE_ATTRACTIONS_CATEGORY = gql`
  mutation createAttractionsCategory(
    $name: String
    $color: String
    $defaultImage: String
    $type: CategoryType
    $companyId: String
  ) {
    createPostCategory(
      name: $name
      color: $color
      defaultImage: $defaultImage
      type: $type
      companyId: $companyId
    ) {
      _id
      message
      processId
      __typename
    }
  }
`
