import { useQuery } from '@apollo/client'
import Tabs from '@app/components/tabs'
import {
  GET_NEW_PRAYER_REQUESTS,
  GET_RECEIVED_PRAYER_REQUESTS,
  GET_PRAYER_REQUESTS
} from './queries'

import PrayerRequestsTable from './components/PrayerRequestsTable'

function PrayerRequests() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountId = user?.accounts?.data[0]?._id
  const companyId = user?.accounts?.data[0]?.company?._id
  const complexId = user?.accounts?.data[0]?.complex?._id
  const { data, refetch } = useQuery(GET_PRAYER_REQUESTS, {
    variables: {
      complexId: complexId
    }
  })

  const prayerRequests = data?.getIssues
  const handleRefetch = () => {
    refetch({
      variables: {
        complexId: complexId
      }
    })
  }

  return (
    <div className="content-wrap">
      <h3 className="content-title">Prayer Requests</h3>
      <Tabs defaultTab={'new'}>
        <Tabs.TabLabels>
          <Tabs.TabLabel id="new">{`New (${
            prayerRequests?.countStatus?.unread || 0
          })`}</Tabs.TabLabel>
          <Tabs.TabLabel id="received">{`Received (${
            prayerRequests?.countStatus?.read || 0
          })`}</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="new">
            <PrayerRequestsTable
              queryTemplate={GET_NEW_PRAYER_REQUESTS}
              status="new"
              user={{
                accountId,
                companyId,
                complexId
              }}
              refetchCounts={handleRefetch}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="received">
            <PrayerRequestsTable
              queryTemplate={GET_RECEIVED_PRAYER_REQUESTS}
              status="received"
              user={{
                accountId,
                companyId,
                complexId
              }}
              refetchCounts={handleRefetch}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default PrayerRequests
