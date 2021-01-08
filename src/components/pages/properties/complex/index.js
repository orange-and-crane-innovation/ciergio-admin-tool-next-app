/* eslint-disable react/jsx-key */
import React from 'react'
import { useRouter } from 'next/router'
import { FaEllipsisH } from 'react-icons/fa'
import { FiEdit2, FiTrash2, FiInfo } from 'react-icons/fi'

import Tabs from '@app/components/tabs'
import Dropdown from '@app/components/dropdown'

import OverviewPage from '../overview'
import AboutPage from '../about'
import HistoryPage from '../history'

import styles from './index.module.css'

const CompanyDataComponent = () => {
  const router = useRouter()

  const goToBuildingData = id => {
    router.push(`/properties/building/${id}`)
  }

  const complexDropdownData = [
    {
      label: 'Edit Complex',
      icon: <FiEdit2 />,
      function: () => alert('clicked')
    }
  ]

  const buildingDropdownData = [
    {
      label: 'Edit Building',
      icon: <FiEdit2 />,
      function: () => alert('clicked')
    },
    {
      label: 'Delete Building',
      icon: <FiTrash2 />,
      function: () => alert('clicked')
    },
    {
      label: 'More Details',
      icon: <FiInfo />,
      function: () => alert('clicked')
    }
  ]

  const tableRowData = [
    {
      name: 'Building Name',
      width: '40%'
    },
    {
      name: 'Residents',
      width: '15%'
    },
    {
      name: 'Point of Contact',
      width: ''
    },
    {
      name: '',
      width: ''
    }
  ]
  const tableData = {
    count: 161,
    limit: 10,
    offset: 0,
    length: 5,
    data: [
      {
        name: (
          <button
            className={styles.ContentLink}
            onClick={() => goToBuildingData('5d79adf32174a96807fec886')}
          >
            Wellington Building A
          </button>
        ),
        residents: '12',
        contact: (
          <div className="flex flex-col items-start">
            <span>Dada Sarte</span>
            <span className="text-neutral-500 text-sm">
              sarte_diane@ymail.com
            </span>
          </div>
        ),
        button: (
          <Dropdown label={<FaEllipsisH />} items={buildingDropdownData} />
        )
      },
      {
        name: (
          <button
            className={styles.ContentLink}
            onClick={() => goToBuildingData('5d79adf32174a96807fec886')}
          >
            Wellington Building B
          </button>
        ),
        residents: '4',
        contact: (
          <div className="flex flex-col items-start">
            <span>Dada Sarte</span>
            <span className="text-neutral-500 text-sm">
              sarte_diane@ymail.com
            </span>
          </div>
        ),
        button: (
          <Dropdown label={<FaEllipsisH />} items={buildingDropdownData} />
        )
      },
      {
        name: (
          <button
            className={styles.ContentLink}
            onClick={() => goToBuildingData('5d79adf32174a96807fec886')}
          >
            Wellington Building C
          </button>
        ),
        residents: '2',
        contact: (
          <div className="flex flex-col items-start">
            <span>Scott Cortez</span>
            <span className="text-neutral-500 text-sm">
              scott@mailcatch.com
            </span>
          </div>
        ),
        button: (
          <Dropdown label={<FaEllipsisH />} items={buildingDropdownData} />
        )
      },
      {
        name: (
          <button
            className={styles.ContentLink}
            onClick={() => goToBuildingData('5d79adf32174a96807fec886')}
          >
            Wellington Building D
          </button>
        ),
        residents: '3',
        contact: (
          <div className="flex flex-col items-start">
            <span>Kelvin Coloma</span>
            <span className="text-neutral-500 text-sm">
              kelvin@orangeandcrane.com
            </span>
          </div>
        ),
        button: (
          <Dropdown label={<FaEllipsisH />} items={buildingDropdownData} />
        )
      },
      {
        name: (
          <button
            className={styles.ContentLink}
            onClick={() => goToBuildingData('5d79adf32174a96807fec886')}
          >
            Wellington Building E
          </button>
        ),
        residents: '0',
        contact: (
          <div className="flex flex-col items-start">
            <span>Dada Sarte</span>
            <span className="text-neutral-500 text-sm">
              sarte_diane@ymail.com
            </span>
          </div>
        ),
        button: (
          <Dropdown label={<FaEllipsisH />} items={buildingDropdownData} />
        )
      }
    ]
  }

  const aboutData = {
    address: 'Atlanta, GA, USA',
    tinNo: '333333333333',
    email: 'Not available',
    contactNo: 'Not available',
    approvedBy: 'Not available'
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
        property: 'Wellington Complex E',
        Activity: 'Diane Sarte added a new complex: Complex E.'
      },
      {
        date: 'June 02, 2020 - 5:09 PM',
        user: 'Jose Lapez',
        property: 'Wellington Complex D',
        Activity: 'Jose Lapez added a new complex: Complex D.'
      },
      {
        date: 'April 07, 2020 - 2:19 PM',
        user: 'Jernaly Sarte',
        property: 'Wellington Complex A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Test 1.'
      },
      {
        date: 'March 13, 2020 - 3:55 PM',
        user: 'Jane Carinas',
        property: 'Wellington Complex C',
        Activity: 'Jane Carinas added a new building in Complex C: Building A.'
      },
      {
        date: 'March 13, 2020 - 3:20 PM',
        user: 'Diane Sarte',
        property: 'Wellington Complex C',
        Activity: 'Diane Sarte added a new complex: Complex C.'
      },
      {
        date: 'March 09, 2020 - 10:56 AM',
        user: 'Jernaly Sarte',
        property: 'Wellington Complex A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 7.'
      },
      {
        date: 'February 26, 2020 - 3:14 PM',
        user: 'Jernaly Sarte',
        property: 'Wellington Complex A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 6.'
      },
      {
        date: 'February 26, 2020 - 2:16 PM',
        user: 'Jernaly Sarte',
        property: 'Wellington Complex A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 5.'
      },
      {
        date: 'February 26, 2020 - 11:36 AM',
        user: 'Jernaly Sarte',
        property: 'Wellington Complex A',
        Activity:
          'Jernaly Sarte added a new building in Wellington Complex A: Tower 4.'
      },
      {
        date: 'February 26, 2020 - 11:33 AM',
        user: 'Jernaly Sarte',
        property: 'Wellington Complex A',
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
              src="https://s3.ap-southeast-1.amazonaws.com/ciergio-online.assets/public/2020/April/03/%201cd24349884276b7cd11144d89bc60f3.jpeg"
            />
          </div>

          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>Wellington Complex A</h1>
            <h2 className={styles.PageHeaderSmall}>Complex</h2>
          </div>
        </div>

        <div className={styles.PageButton}>
          <Dropdown label={<FaEllipsisH />} items={complexDropdownData} />
        </div>
      </div>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
          <Tabs.TabLabel id="2">About</Tabs.TabLabel>
          <Tabs.TabLabel id="3">History</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <OverviewPage
              type="complex"
              title="Buildings"
              propertyHeader={tableRowData}
              propertyData={tableData}
              historyHeader={tableRowHistoryData}
              historyData={tableHistoryData}
              activePage={1}
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
              onCreateButtonClick={() => alert('Create button clicked!')}
              onHistoryButtonClick={() => alert('History button clicked!')}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <AboutPage
              address={aboutData.address}
              tinNo={aboutData.tinNo}
              email={aboutData.email}
              contactNo={aboutData.contactNo}
              approvedBy={aboutData.approvedBy}
              onButtonClick={() => alert('button clicked!')}
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

export default CompanyDataComponent
