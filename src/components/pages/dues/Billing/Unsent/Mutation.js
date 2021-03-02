import { gql } from '@apollo/client'

export const CREATE_DUES = gql`
  mutation createDues($data: DuesInput) {
    createDues(data: $data) {
      _id
      processId
    }
  }
`
