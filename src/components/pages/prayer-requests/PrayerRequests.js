import { useQuery } from '@apollo/client'

import Tabs from '@app/components/tabs'
import {
  GET_NEW_PRAYER_REQUESTS,
  GET_RECEIVED_PRAYER_REQUESTS,
  GET_PRAYER_REQUESTS
} from './queries'

import PrayerRequestsTable from './components/PrayerRequestsTable'

function PrayerRequests() {
  const { data } = useQuery(GET_PRAYER_REQUESTS, {
    variables: {
      complexId: '5f291193643d6011be2d280b'
    }
  })

  const prayerRequests = data?.getIssues

  return (
    <div className="content-wrap">
      <h3 className="content-title">Prayer Requests</h3>

      <Tabs defaultTab="new">
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
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="received">
            <PrayerRequestsTable
              queryTemplate={GET_RECEIVED_PRAYER_REQUESTS}
              status="received"
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default PrayerRequests
