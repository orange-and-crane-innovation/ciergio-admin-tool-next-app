import { gql } from '@apollo/client'

export const GET_UNSENT_DUES_QUERY = gql`
  query getDuesPerUnit(
    $unit: DuesPerUnitInput2
    $filter: DuesPerUnitInput3
    $dues: DuesPerUnitInput1
    $offset: Int
    $limit: Int
  ) {
    getDuesPerUnit(
      unit: $unit
      filter: $filter
      limit: $limit
      offset: $offset
      dues: $dues
    ) {
      count
      limit
      offset
      data {
        floorNumber
        name
        company {
          _id
        }
        complex {
          _id
        }

        unitOwner {
          unit {
            _id
          }
          _id
          user {
            firstName
            lastName
          }
        }
        dues {
          category {
            _id
          }
        }
      }
    }
  }
`

export const GET_ALL_FLOORS = gql`
  query getFloorNUmbers($buildingId: String!) {
    getFloorNumbers(buildingId: $buildingId)
  }
`

export const GETDEUS_QUERY = gql`
  query getDues($where: DuesQueryInput) {
    getDues(where: $where) {
      count {
        all
        seen
        sent
        units {
          all
          withResidents
        }
      }
    }
  }
`
