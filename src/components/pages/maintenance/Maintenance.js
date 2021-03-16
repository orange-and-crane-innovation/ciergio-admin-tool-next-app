import Tickets from './components/Tickets'
import Tabs from '@app/components/tabs'
import TicketsTable from './components/TicketsTab'
import TicketContent from './components/TicketTabContent'
import { unassignedColumns, defaultColumns } from './columns'

function Maintenance() {
  return (
    <section className="content-wrap">
      <h1 className="content-title">Tower 1 Residents</h1>

      <Tickets />
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Unassigned</Tabs.TabLabel>
          <Tabs.TabLabel id="2">In Progress</Tabs.TabLabel>
          <Tabs.TabLabel id="3">On Hold</Tabs.TabLabel>
          <Tabs.TabLabel id="4">Resolved</Tabs.TabLabel>
          <Tabs.TabLabel id="5">Cancelled</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <TicketContent
              title="Unassigned Tickets"
              content={
                <TicketsTable columns={unassignedColumns} type="unassigned" />
              }
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <TicketContent
              title="In Progress Tickets"
              content={<TicketsTable columns={defaultColumns} type="ongoing" />}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <TicketContent
              title="On Hold Tickets"
              content={<TicketsTable columns={defaultColumns} type="onhold" />}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="4">
            <TicketContent
              title="Resolved Tickets"
              content={
                <TicketsTable columns={defaultColumns} type="resolved" />
              }
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="5">
            <TicketContent
              title="Cancelled Tickets"
              content={
                <TicketsTable columns={defaultColumns} type="cancelled" />
              }
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Maintenance
