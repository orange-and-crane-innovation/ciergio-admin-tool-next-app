import gql from 'graphql-tag'
import { Pagev2 } from '@app/utils/schema-varibles'

export const GET_DONATIONS = gql`
    query getDonations($complexId: String, $search: String, $limit: Int, $sort: Int, $offset: Int) {
        getDonations(where: {
            complexId: $complexId
        }, search: $search, limit: $limit, offset: $offset, sort: $sort,) {
            ${Pagev2}
            data {
                name
                email
                bankCharges
                ociFee
                netAmount
                senderReferenceCode
                reconciliationId
                transactionId
                status
                createAt
                updatedAt
                __typename
            }
            __typename
        }
    }
`
