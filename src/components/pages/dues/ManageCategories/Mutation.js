import { gql } from '@apollo/client'

export const SAVE_ALLOWED_CATEGORY = gql`
  mutation(
    $accountType: CategoryAccountType
    $accountId: String
    $categoryIds: [String]
  ) {
    addBillCategory(
      accountType: $accountType
      accountId: $accountId
      categoryIds: $categoryIds
    ) {
      message
      processId
    }
  }
`

export const REMOVE_ALLOWED_CATEGORY = gql`
  mutation(
    $accountType: CategoryAccountType
    $accountId: String
    $categoryIds: [String]
  ) {
    removeBillCategory(
      accountType: $accountType
      accountId: $accountId
      categoryIds: $categoryIds
    ) {
      message
      proccessId
    }
  }
`
