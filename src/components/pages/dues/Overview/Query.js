import { gql } from '@apollo/client'

export const GET_BUILDINS = gql`
  query getBuildings($where: GetBuildingsParams) {
    getBuildings(where: $where) {
      count
      limit
      skip
      data {
        _id
        address {
          city
          formattedAddress
        }
        complex {
          _id
          name
          status
        }
        coverPhoto
        createdAt
        name
        residents {
          count
          data {
            _id
            status
          }
          limit
          skip
        }
        status
        units {
          count
          data {
            createdAt
            floorName
            floorNumber
            name
            profileColor
            status
            unitSize
            updatedAt
          }
        }
      }
    }
  }
`
