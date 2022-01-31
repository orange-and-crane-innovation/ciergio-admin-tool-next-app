import { gql } from '@apollo/client'

const getCompanySettings = gql`
  query CompanySettings($where: getCompanySettingsParams) {
    getCompanySettings(where: $where) {
      _id
      paymentSettings {
        paymentToggle
      }
      allowPublicPosts
      keepActivityLogs
      keepDeletedPosts
      subscriptionModules {
        bulletinBoard {
          enable
        }
        messages {
          enable
        }
        qrCode {
          enable
        }
        notifications {
          enable
        }
        directory {
          enable
        }
        forms {
          enable
        }
        contactPage {
          enable
        }
        guestAndDelivery {
          enable
        }
        maintenanceAndRepairs {
          enable
        }
        myDues {
          enable
        }
        communityBoard {
          enable
        }
        prayerRequests {
          enable
        }
        dailyReading {
          enable
        }
        donations {
          enable
        }
      }
    }
  }
`

const updateCompanySettings = gql`
  mutation updateCompanySettings(
    $data: InputUpdateCompanySettings
    $companyId: String
  ) {
    updateCompanySettings(data: $data, companyId: $companyId) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
      companyLogo
    }
  }
`
export { getCompanySettings, updateCompanySettings }
