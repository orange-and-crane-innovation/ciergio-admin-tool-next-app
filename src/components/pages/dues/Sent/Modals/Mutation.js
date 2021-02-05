import { gql } from '@apollo/client'

export const CREATE_DUES = gql`
  mutation updateDues($id: String!, data: DuesInput) {
    createDes(data: $data, id: $id ) {
      message
      processId
    }
  }
`
