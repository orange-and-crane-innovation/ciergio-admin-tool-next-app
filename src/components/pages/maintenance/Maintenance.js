import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import Tickets from './components/Tickets'
import Tabs from '@app/components/tabs'
import TicketContent from './components/TicketTabContent'
import { unassignedColumns, defaultColumns } from './columns'
import { GET_STAFFS, GET_CATEGORIES } from './queries'

function Maintenance() {
  const [categoryId, setCategoryId] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [staffId, setStaffId] = useState('')
  const { data: staffs } = useQuery(GET_STAFFS, {
    variables: {
      where: {
        accountTypes: ['company_admin', 'complex_admin', 'building_admin'],
        companyId: '',
        complexId: '',
        buildingId: ''
      }
    }
  })
  const { data: categories } = useQuery(GET_CATEGORIES, {
    variables: {}
  })

  const handleCategoryChange = cat => setCategoryId(cat.value)
  const handleClearCategory = () => setCategoryId(null)
  const handleSearchTextChange = e => setSearchText(e.target.value)
  const handleStaffChange = staff => setStaffId(staff.value)
  const handleClearStaff = () => setStaffId(null)

  const staffOptions = useMemo(() => {
    if (staffs?.getRepairsAndMaintenanceStaffs?.data?.length > 0) {
      return staffs?.getRepairsAndMaintenanceStaffs?.data.map(staff => {
        const user = staff.user
        return {
          label: `${user.firstName} ${user.lastName} ${staff.accountType} `,
          value: staff._id
        }
      })
    }
    return []
  }, [staffs?.getRepairsAndMaintenanceStaffs])

  const categoryOptions = useMemo(() => {
    if (categories?.getAllowedPostCategory?.data?.length > 0) {
      return categories.getAllowedPostCategory.data.map(staff => {
        const user = staff.user
        return {
          label: `${user.firstName} ${user.lastName} ${staff.accountType} `,
          value: staff._id
        }``
      })
    }
    return []
  }, [categories?.getAllowedPostCategory])

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
              categoryOptions={categoryOptions}
              searchText={searchText}
              categoryId={categoryId}
              staffId={staffId}
              columns={unassignedColumns}
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
              categoryOptions={categoryOptions}
              searchText={searchText}
              categoryId={categoryId}
              staffId={staffId}
              columns={defaultColumns}
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
              categoryOptions={categoryOptions}
              searchText={searchText}
              categoryId={categoryId}
              staffId={staffId}
              columns={defaultColumns}
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
              categoryOptions={categoryOptions}
              searchText={searchText}
              categoryId={categoryId}
              staffId={staffId}
              columns={defaultColumns}
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
              categoryOptions={categoryOptions}
              searchText={searchText}
              categoryId={categoryId}
              staffId={staffId}
              columns={defaultColumns}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Maintenance
