import { gql } from '@apollo/client'

export const CREATE_DUES = gql`
  mutation createDues($companyId: String! $complexId: String! data: DuesInput) {
    updateDues(data: $data, companyId: $companyId, complexId: $complexId ) {
      _id
      message
      processDues
    }
  }
`
