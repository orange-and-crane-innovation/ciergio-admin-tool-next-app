import gql from 'graphql-tag'

export const GET_DONATIONS = gql`
  query getDonations(
    $date: PaymentDateFilterInput
    $companyId: String
    $complexId: String
    $paymentMethod: PaymentMethod
    $search: String
    $limit: Int
    $sort: Int
    $offset: Int
  ) {
    getDonations(
      where: {
        srcRef: { companyId: $companyId, complexId: $complexId }
        date: $date
        method: $paymentMethod
      }
      search: $search
      limit: $limit
      offset: $offset
      sort: $sort
    ) {
      limit
      offset
      overallTotal
      overallTotalNet
      overallCount
      data {
        count
        total
        totalnet
        date {
          month
          day
          year
        }
        data {
          email
          name
          amount
          bankCharges
          ociFee
          netAmount
          senderReferenceCode
          reconciliationId
          transactionId
          srcReference {
            company {
              name
            }
            complex {
              name
            }
          }
          status
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const GET_PAYMENT_METHODS = gql`
  query {
    getPaymentMethods {
      count
      data {
        label
        value
      }
    }
  }
`
