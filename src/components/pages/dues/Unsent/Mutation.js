import { gql } from '@apollo/client'

export const CREATE_DUES = gql`
  mutation createDues($companyId: String! $complexId: String! data: DuesInput) {
    createDes(data: $data, companyId: $companyId, complexId: $complexId ) {
      _id
      message
      processDues
    }
  }
`
