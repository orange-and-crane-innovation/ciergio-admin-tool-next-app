import { gql } from '@apollo/client'

export const GET_CATEGORIES = gql`
  query getBillCategory($where: BillCategoryQueryInput) {
    getBillCategory(limit: 100, where: $where) {
      category {
        color
        name
        _id
        restrictedTo {
          companyId
          buildingId
          complexId
        }
        _id
      }

      count
      limit
      offset
    }
  }
`

export const GET_ALLOWED_CATEGORIES = gql`
  query getAllowedBillCategory($where: AllowedBillCategoryInput) {
    getAllowedBillCategory(where: $where, limit: 100, offset: 0) {
      data {
        categories {
          color
          name
          _id
        }
      }
    }
  }
`
