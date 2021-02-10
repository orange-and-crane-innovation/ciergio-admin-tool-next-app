import { gql } from '@apollo/client'

export const GET_BUILDINS = gql`
  query getBuildings($where: GetBuildingParams) {
    getBuildings(where: $where) {
      data {
        name
        __typename
        _id
      }
    }
  }
`

export const GET_ALLOWED_CATEGORY = gql`
  query getAllowedBillCategory($where: AllowedBillCategoryInput, $limit: Int) {
    getAllowedBillCategory(where: $where, limit: $limit) {
      count
      limit
      offset
      data {
        categories {
          color
          name
          __typename
          _id
        }
      }
    }
  }
`
