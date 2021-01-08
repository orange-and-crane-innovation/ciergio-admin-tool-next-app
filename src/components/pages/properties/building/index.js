/* eslint-disable react/jsx-key */
import React from 'react'
import { useRouter } from 'next/router'
import { FaEllipsisH } from 'react-icons/fa'
import { FiEdit2, FiTrash2, FiFile } from 'react-icons/fi'

import Tabs from '@app/components/tabs'
import Dropdown from '@app/components/dropdown'
import Checkbox from '@app/components/forms/form-checkbox'

import OverviewPage from '../overview'
import HistoryPage from '../history'
import UnitPage from '../unit'

import styles from './index.module.css'

const BuildingDataComponent = () => {
  const router = useRouter()

  const goToComplexData = id => {
    router.push(`/properties/complex/${id}`)
  }

  const dropdownData = [
    {
      label: 'View Unit',
      icon: <FiFile />,
      function: () => alert('clicked')
    },
    {
      label: 'Edit Unit',
      icon: <FiEdit2 />,
      function: () => alert('clicked')
    },
    {
      label: 'Delete Unit',
      icon: <FiTrash2 />,
      function: () => alert('clicked')
    }
  ]

  const buildingDropdownData = [
    {
      label: 'Edit Building',
      icon: <FiEdit2 />,
      function: () => alert('clicked')
    }
  ]

  const tableRowData = [
    {
      name: 'Unit Type',
      width: '40%'
    },
    {
      name: 'Floor Area (sqm)',
      width: '30%'
    },
    {
      name: 'Quantity',
      width: '30%'
    }
  ]

  const tableData = {
    count: 161,
    limit: 10,
    offset: 0,
    length: 5,
    data: [
      {
        name: 'Office A',
        floor: '60',
        quantity: '1'
      },
      {
        name: 'Studio',
        floor: '45',
        quantity: '2'
      },
      {
        name: '1-Bedroom',
        floor: '30',
        quantity: '1'
      },
      {
        name: '2-Bedroom',
        floor: '50.50',
        quantity: '3'
      },
      {
        name: 'Studio type',
        floor: '50',
        quantity: '1'
      },
      {
        name: '3-Bedroom',
        floor: '65',
        quantity: '1'
      },
      {
        name: 'Pent house',
        floor: '55',
        quantity: '1'
      }
    ]
  }

  const tableRowUnitData = [
    {
      name: (
        <Checkbox
          primary
          id="select_all"
          name="select_all"
          onChange={() => console.log('clicked')}
        />
      ),
      width: ''
    },
    {
      name: 'Unit #',
      width: '15%'
    },
    {
      name: 'Unit Owner',
      width: '20%'
    },
    {
      name: 'Date Created',
      width: '20%'
    },
    {
      name: '# of Residents',
      width: '15%'
    },
    {
      name: 'Unit Type',
      width: '20%'
    },
    {
      name: '',
      width: ''
    }
  ]

  const tableUnitData = {
    count: 161,
    limit: 10,
    offset: 0,
    length: 5,
    data: [
      {
        checkbox: (
          <Checkbox
            primary
            id="unit_101"
            name="unit_101"
            onChange={() => console.log('clicked')}
          />
        ),
        floorNo: 1,
        unit: '101',
        name: 'Andy Cruz',
        date: 'September 17, 2019 - 11:13 AM',
        residents: '1',
        unitType: '10 BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        checkbox: (
          <Checkbox
            primary
            id="unit_102"
            name="unit_102"
            onChange={() => console.log('clicked')}
          />
        ),
        floorNo: 1,
        unit: '102',
        name: 'Andy Cruz',
        date: 'September 17, 2019 - 11:13 AM',
        residents: '1',
        unitType: '10 BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        checkbox: (
          <Checkbox
            primary
            id="unit_103"
            name="unit_103"
            onChange={() => console.log('clicked')}
          />
        ),
        floorNo: 1,
        unit: '103',
        name: 'Andy Cruz',
        date: 'September 17, 2019 - 11:13 AM',
        residents: '1',
        unitType: '10 BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        checkbox: (
          <Checkbox
            primary
            id="unit_104"
            name="unit_104"
            onChange={() => console.log('clicked')}
          />
        ),
        floorNo: 1,
        unit: '104',
        name: 'Andy Cruz',
        date: 'September 17, 2019 - 11:13 AM',
        residents: '1',
        unitType: '10 BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        checkbox: (
          <Checkbox
            primary
            id="unit_105"
            name="unit_105"
            onChange={() => console.log('clicked')}
          />
        ),
        floorNo: 1,
        unit: '105',
        name: 'Andy Cruz',
        date: 'September 17, 2019 - 11:13 AM',
        residents: '1',
        unitType: '10 BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        checkbox: (
          <Checkbox
            primary
            id="unit_201"
            name="unit_201"
            onChange={() => console.log('clicked')}
          />
        ),
        floorNo: 2,
        unit: '201',
        name: 'Andy Cruz',
        date: 'September 17, 2019 - 11:13 AM',
        residents: '1',
        unitType: '10 BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        checkbox: (
          <Checkbox
            primary
            id="unit_202"
            name="unit_202"
            onChange={() => console.log('clicked')}
          />
        ),
        floorNo: 2,
        unit: '202',
        name: 'Andy Cruz',
        date: 'September 17, 2019 - 11:13 AM',
        residents: '1',
        unitType: '10 BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      }
    ]
  }

  const tableRowHistoryData = [
    {
      name: 'Date & Time',
      width: '25%'
    },
    {
      name: 'User',
      width: '15%'
    },
    {
      name: 'Property',
      width: '20%'
    },
    {
      name: 'Activity',
      width: '30%'
    }
  ]

  const tableHistoryData = {
    count: 161,
    limit: 10,
    offset: 0,
    data: [
      {
        date: 'September 11, 2020 - 5:25 PM',
        user: 'Diane Sarte',
        property: 'Wellington Building E',
        Activity: 'Diane Sarte added a new complex: Complex E.'
      },
      {
        date: 'June 02, 2020 - 5:09 PM',
        user: 'Jose Lapez',
        property: 'Wellington Building D',
        Activity: 'Jose Lapez added a new complex: Complex D.'
      },
      {
        date: 'April 07, 2020 - 2:19 PM',
        user: 'Jernaly Sarte',
        property: 'Wellington Building A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Test 1.'
      },
      {
        date: 'March 13, 2020 - 3:55 PM',
        user: 'Jane Carinas',
        property: 'Wellington Building C',
        Activity: 'Jane Carinas added a new building in Complex C: Building A.'
      },
      {
        date: 'March 13, 2020 - 3:20 PM',
        user: 'Diane Sarte',
        property: 'Wellington Building C',
        Activity: 'Diane Sarte added a new complex: Complex C.'
      },
      {
        date: 'March 09, 2020 - 10:56 AM',
        user: 'Jernaly Sarte',
        property: 'Wellington Building A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 7.'
      },
      {
        date: 'February 26, 2020 - 3:14 PM',
        user: 'Jernaly Sarte',
        property: 'Wellington Building A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 6.'
      },
      {
        date: 'February 26, 2020 - 2:16 PM',
        user: 'Jernaly Sarte',
        property: 'Wellington Building A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 5.'
      },
      {
        date: 'February 26, 2020 - 11:36 AM',
        user: 'Jernaly Sarte',
        property: 'Wellington Building A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 4.'
      },
      {
        date: 'February 26, 2020 - 11:33 AM',
        user: 'Jernaly Sarte',
        property: 'Wellington Building A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 3.'
      }
    ]
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderContainer}>
        <div className="flex items-center">
          <div className={styles.PageHeaderLogo}>
            <img
              alt="logo"
              src="https://s3.ap-southeast-1.amazonaws.com/ciergio-online.assets/public/2020/February/03/%20dfad298e5c15c97e8823bedb2aa3df66.png"
            />
          </div>

          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>Wellington Building A</h1>
            <h2 className={styles.PageHeaderSmall}>Building</h2>
          </div>
        </div>

        <div className={styles.PageButton}>
          <Dropdown label={<FaEllipsisH />} items={buildingDropdownData} />
        </div>
      </div>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Unit Directory</Tabs.TabLabel>
          <Tabs.TabLabel id="3">History</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <OverviewPage
              type="building"
              title="Unit Breakdown"
              propertyHeader={tableRowData}
              propertyData={tableData}
              historyHeader={tableRowHistoryData}
              historyData={tableHistoryData}
              activePage={1}
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
              onCreateButtonClick={() => alert('Create button clicked!')}
              onHistoryButtonClick={() => alert('History button clicked!')}
              onUnitButtonClick={() => alert('History button clicked!')}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <UnitPage
              title="Units"
              tableHeader={tableRowUnitData}
              tableData={tableUnitData}
              activePage={1}
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
              onCreateButtonClick={() => alert('Create button clicked!')}
              onHistoryButtonClick={() => alert('History button clicked!')}
              onUnitButtonClick={() => alert('History button clicked!')}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <HistoryPage
              header={tableRowHistoryData}
              data={tableHistoryData}
              activePage={1}
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default BuildingDataComponent
