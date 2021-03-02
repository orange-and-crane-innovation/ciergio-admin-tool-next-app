import { gql } from '@apollo/client'

export const UPDATE_DUES = gql`
  mutation updateDues($id: String!, $data: DuesInput) {
    updateDues(data: $data, id: $id) {
      message
      processId
    }
  }
`
