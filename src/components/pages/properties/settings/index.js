/* eslint-disable react/jsx-key */
import React from 'react'

import Card from '@app/components/card'
import Checkbox from '@app/components/forms/form-checkbox'

import styles from './index.module.css'

const CompanySettingsComponent = () => {
  const bulletinCategoriesData = [
    {
      name: 'Announcements',
      checked: true
    },
    {
      name: 'Attractions',
      checked: true
    },
    {
      name: 'Building Cleanup',
      checked: false
    },
    {
      name: 'Daily Inspirations',
      checked: true
    },
    {
      name: 'Emergency',
      checked: false
    },
    {
      name: 'Environment',
      checked: true
    },
    {
      name: 'Parking Maintenance',
      checked: false
    },
    {
      name: 'Events',
      checked: false
    },
    {
      name: 'Facilities',
      checked: false
    },
    {
      name: 'Newsletter',
      checked: true
    },
    {
      name: 'Sale',
      checked: false
    },
    {
      name: 'Sponsor',
      checked: true
    },
    {
      name: 'Technology',
      checked: false
    },
    {
      name: 'Updates',
      checked: false
    },
    {
      name: 'Utilities',
      checked: false
    }
  ]
  const RMCategoriesData = [
    {
      name: 'Cable Repair',
      checked: false
    },
    {
      name: 'Defective Hardware',
      checked: true
    },
    {
      name: 'Electricity Repair',
      checked: false
    },
    {
      name: 'General Cleaning Maintenance',
      checked: true
    },
    {
      name: 'Installation',
      checked: false
    },
    {
      name: 'Internet Repair',
      checked: true
    },
    {
      name: 'Parking Maintenance',
      checked: false
    },
    {
      name: 'Plumbing Repair',
      checked: false
    },
    {
      name: 'Preventive Maintenance',
      checked: false
    },
    {
      name: 'Protective Maintenance',
      checked: true
    },
    {
      name: 'Security Maintenance',
      checked: false
    },
    {
      name: 'Unit Repair',
      checked: true
    },
    {
      name: 'Utility Maintenance',
      checked: false
    },
    {
      name: 'Water Repair',
      checked: false
    }
  ]
  const notifCategoriesData = [
    {
      name: 'Flash 1 - Announcements',
      checked: false
    },
    {
      name: 'Flash 2 - Ads',
      checked: true
    },
    {
      name: 'Flash 3 - Meeting',
      checked: false
    },
    {
      name: 'Flash 4 - Warning',
      checked: true
    },
    {
      name: 'Flash 5 - Invitation',
      checked: false
    },
    {
      name: 'Flash 6 - General Meeting',
      checked: true
    },
    {
      name: 'Flash 7 - Association Meeting',
      checked: false
    },
    {
      name: 'Flash 8 - Billing Reminder',
      checked: false
    },
    {
      name: 'Flash 9 - General Cleaning',
      checked: false
    }
  ]

  return (
    <div className={styles.PageContainer}>
      <div className="w-full text-base lg:w-3/4">
        <div className="text-lg font-bold my-4">General</div>
        <div className="text-lg font-bold my-4">Features</div>
        <div>
          Every property in this company will have access to the enabled
          features.
        </div>

        <br />
        <div className="text-lg font-bold my-4">Bulletin Board</div>
        <Card
          noPadding
          content={
            <div className="p-4">
              <div className="text-lg font-bold mb-4">
                Bulletin Board Categories
              </div>
              <div>
                These will be the available categories for everyone in your
                property.
              </div>
              <div>
                <label className="inline-flex items-center mt-3">
                  <ul className={styles.CheckboxListContainer}>
                    {bulletinCategoriesData.map((item, index) => {
                      return (
                        <li key={index}>
                          <Checkbox
                            primary
                            id={`bulletin-${index}`}
                            name="post_category"
                            label={item.name}
                            isChecked={item.checked}
                            onChange={() => console.log('clicked')}
                          />
                        </li>
                      )
                    })}
                  </ul>
                </label>
              </div>
            </div>
          }
        />

        <br />
        <div className="text-lg font-bold my-4">Maintenance and Repairs</div>
        <Card
          noPadding
          content={
            <div className="p-4">
              <div className="text-lg font-bold mb-4">
                Maintenance and Repairs Categories
              </div>
              <div>
                These will be the available categories for everyone in your
                property.
              </div>
              <div>
                <label className="inline-flex items-center mt-3">
                  <ul className={styles.CheckboxListContainer}>
                    {RMCategoriesData.map((item, index) => {
                      return (
                        <li key={index}>
                          <Checkbox
                            primary
                            id={`rm-${index}`}
                            name="post_category"
                            label={item.name}
                            isChecked={item.checked}
                            onChange={() => console.log('clicked')}
                          />
                        </li>
                      )
                    })}
                  </ul>
                </label>
              </div>
            </div>
          }
        />

        <br />
        <div className="text-lg font-bold my-4">
          Flash Notifications Categories
        </div>
        <Card
          noPadding
          content={
            <div className="p-4">
              <div className="text-lg font-bold mb-4">
                Flash Notifications Categories
              </div>
              <div>
                These will be the available categories for everyone in your
                property.
              </div>
              <div>
                <label className="inline-flex items-center mt-3">
                  <ul className={styles.CheckboxListContainer}>
                    {notifCategoriesData.map((item, index) => {
                      return (
                        <li key={index}>
                          <Checkbox
                            primary
                            id={`rm-${index}`}
                            name="post_category"
                            label={item.name}
                            isChecked={item.checked}
                            onChange={() => console.log('clicked')}
                          />
                        </li>
                      )
                    })}
                  </ul>
                </label>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default CompanySettingsComponent
