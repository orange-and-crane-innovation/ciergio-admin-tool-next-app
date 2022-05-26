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
          displayName
          group
        }

        bulletinBoard {
          displayName
          group
        }
        myProperties {
          displayName
          group
        }
        myStaff {
          displayName
          group
        }
        myResidents {
          displayName
          group
          enable
        }
        attactionsAndEvents {
          displayName
          group
          enable
        }
        myMembers {
          displayName
          group
          enable
        }

        messages {
          displayName
          group
        }
        notifications {
          displayName
          group
        }
        forms {
          displayName
          group
        }
        directory {
          displayName
          group
          enable
        }
        qrCode {
          displayName
          group
          enable
        }
        contactPage {
          displayName
          group
          enable
        }
        guestAndDelivery {
          displayName
          group
          enable
        }
        maintenanceAndRepairs {
          displayName
          group
          enable
        }
        myDues {
          displayName
          group
          enable
        }
        communityBoard {
          displayName
          group
          enable
        }
        settingsPage {
          displayName
          group
          enable
        }
        prayerRequests {
          displayName
          group
          enable
        }
        dailyReading {
          displayName
          group
          enable
        }
        donations {
          displayName
          group
          enable
        }
        homePage {
          displayName
          group
          enable
        }
        faqPage {
          displayName
          group
          enable
        }
        pastoralWorks {
          displayName
          group
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

const getComplexes = gql`
  query getComplexes($where: GetComplexesParams) {
    getComplexes(where: $where) {
      count
      limit
      skip
      data {
        _id
        name
        buildings {
          count
        }
      }
    }
  }
`

export { getCompanySettings, updateCompanySettings, getComplexes }
