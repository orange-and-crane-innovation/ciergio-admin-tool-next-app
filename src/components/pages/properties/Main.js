/* eslint-disable react/jsx-key */
import React from 'react'
import Tabs from '@app/components/tabs'

import styles from './Main.module.css'

const PropertiesComponent = () => {
  return (
    <div className={styles.PageContainer}>
      <h1 className={styles.PageHeader}>Orange and Crane Innovations Inc.</h1>
      <h2 className={styles.PageHeaderSmall}>Company</h2>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Companies</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">Tab 1</Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default PropertiesComponent
