import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import useDebounce from '@app/utils/useDebounce'
import Tickets from './components/Tickets'
import Tabs from '@app/components/tabs'
import TicketContent from './components/TicketTabContent'
import { unassignedColumns, defaultColumns } from './columns'
import { GET_STAFFS, GET_BUILDING } from './queries'

const tabs = [
  {
    title: 'Unassigned',
    status: 'unassigned',
    columns: unassignedColumns
  },
  {
    title: 'In Progress',
    status: 'ongoing',
    columns: defaultColumns
  },
  {
    title: 'On Hold',
    status: 'onhold',
    columns: defaultColumns
  },
  {
    title: 'Resolved',
    status: 'resolved',
    columns: defaultColumns
  },
  {
    title: 'Cancelled',
    status: 'cancelled',
    columns: defaultColumns
  }
]

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
  const { data: buildings } = useQuery(GET_BUILDING, {
    variables: {
      where: {
        _id: query?.buildingId
      }
    }
  })
  const { data: staffs } = useQuery(GET_STAFFS, {
    variables: {
      where: {
        accountTypes: ['company_admin', 'complex_admin'],
        companyId: userCompany?.company?._id,
        complexId: query?.complexId,
        buildingId: query?.buildingId
      }
    }
  })

  const buildingName = buildings?.getBuildings?.data[0]?.name

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
      <h1 className="content-title">
        {buildingName ? `${buildingName} Tickets` : null}
      </h1>
      <Tickets buildingId={query?.buildingId} />
      <Tabs defaultTab="unassigned">
        <Tabs.TabLabels>
          {tabs.map(tab => (
            <Tabs.TabLabel key={tab.status} id={tab.status}>
              {tab.title}
            </Tabs.TabLabel>
          ))}
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          {tabs.map(tab => (
            <Tabs.TabPanel key={tab.status} id={tab.status}>
              <TicketContent
                title={tab.title}
                type={tab.status}
                onCategoryChange={handleCategoryChange}
                onClearCategory={handleClearCategory}
                onSearchTextChange={handleSearchTextChange}
                onStaffChange={handleStaffChange}
                onClearStaff={handleClearStaff}
                staffOptions={staffOptions}
                searchText={debouncedSearchText}
                category={category}
                staff={staff}
                columns={tab.columns}
                onClearSearch={handleClearSearch}
                buildingId={query?.buildingId}
                profileId={user?._id}
              />
            </Tabs.TabPanel>
          ))}
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Maintenance
