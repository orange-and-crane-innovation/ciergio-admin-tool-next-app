import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import useDebounce from '@app/utils/useDebounce'
import Tickets from './components/Tickets'
import Tabs from '@app/components/tabs'
import TicketContent from './components/TicketTabContent'
import { unassignedColumns, defaultColumns } from './columns'
import { GET_STAFFS } from './queries'

function Maintenance() {
  const { query } = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const userCompany = user?.accounts?.data?.find(
    account => account?.accountType === 'company_admin'
  )
  const [category, setCategory] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [staff, setStaff] = useState('')
  const debouncedSearchText = useDebounce(searchText, 700)
  const { data: staffs } = useQuery(GET_STAFFS, {
    variables: {
      where: {
        accountTypes: ['company_admin', 'complex_admin', 'building_admin'],
        companyId: userCompany?.company?._id,
        complexId: query?.complexId,
        buildingId: query?.buildingId
      }
    }
  })

  const handleCategoryChange = e => setCategory(e.value !== '' ? e.value : null)
  const handleClearCategory = () => setCategory(null)
  const handleSearchTextChange = e => setSearchText(e.target.value)
  const handleStaffChange = staff => setStaff(staff)
  const handleClearStaff = () => setStaff(null)
  const handleClearSearch = () => setSearchText(null)

  const staffOptions = useMemo(() => {
    if (staffs?.getRepairsAndMaintenanceStaffs?.data?.length > 0) {
      return staffs?.getRepairsAndMaintenanceStaffs?.data.map(staff => {
        const user = staff.user
        return {
          label: <span>{`${user.firstName} ${user.lastName} `}</span>,
          value: staff._id
        }
      })
    }
    return []
  }, [staffs?.getRepairsAndMaintenanceStaffs])

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
              type="unassigned"
              onCategoryChange={handleCategoryChange}
              onClearCategory={handleClearCategory}
              onSearchTextChange={handleSearchTextChange}
              onStaffChange={handleStaffChange}
              onClearStaff={handleClearStaff}
              staffOptions={staffOptions}
              searchText={debouncedSearchText}
              category={category}
              staff={staff}
              columns={unassignedColumns}
              onClearSearch={handleClearSearch}
              buildingId={query?.buildingId}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <TicketContent
              title="In Progress Tickets"
              type="ongoing"
              onCategoryChange={handleCategoryChange}
              onClearCategory={handleClearCategory}
              onSearchTextChange={handleSearchTextChange}
              onStaffChange={handleStaffChange}
              onClearStaff={handleClearStaff}
              staffOptions={staffOptions}
              searchText={debouncedSearchText}
              category={category}
              staff={staff}
              columns={defaultColumns}
              onClearSearch={handleClearSearch}
              buildingId={query?.buildingId}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <TicketContent
              title="On Hold Tickets"
              type="onhold"
              onCategoryChange={handleCategoryChange}
              onClearCategory={handleClearCategory}
              onSearchTextChange={handleSearchTextChange}
              onStaffChange={handleStaffChange}
              onClearStaff={handleClearStaff}
              staffOptions={staffOptions}
              searchText={debouncedSearchText}
              category={category}
              staff={staff}
              columns={defaultColumns}
              onClearSearch={handleClearSearch}
              buildingId={query?.buildingId}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="4">
            <TicketContent
              title="Resolved Tickets"
              type="resolved"
              onCategoryChange={handleCategoryChange}
              onClearCategory={handleClearCategory}
              onSearchTextChange={handleSearchTextChange}
              onStaffChange={handleStaffChange}
              onClearStaff={handleClearStaff}
              staffOptions={staffOptions}
              searchText={debouncedSearchText}
              category={category}
              staff={staff}
              columns={defaultColumns}
              onClearSearch={handleClearSearch}
              buildingId={query?.buildingId}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="5">
            <TicketContent
              title="Cancelled Tickets"
              type="cancelled"
              onCategoryChange={handleCategoryChange}
              onClearCategory={handleClearCategory}
              onSearchTextChange={handleSearchTextChange}
              onStaffChange={handleStaffChange}
              onClearStaff={handleClearStaff}
              staffOptions={staffOptions}
              searchText={debouncedSearchText}
              category={category}
              staff={staff}
              columns={defaultColumns}
              onClearSearch={handleClearSearch}
              buildingId={query?.buildingId}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Maintenance
