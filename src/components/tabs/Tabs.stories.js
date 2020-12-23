import React from 'react'
import Tabs from '.'

export default {
  title: 'Tabs',
  component: Tabs
}

export const AllTabs = () => (
  <>
    <Tabs defaultTab="1">
      <Tabs.TabLabels>
        <Tabs.TabLabel id="1">Tab 1</Tabs.TabLabel>
        <Tabs.TabLabel id="2">Tab 2</Tabs.TabLabel>
      </Tabs.TabLabels>
      <Tabs.TabPanels>
        <Tabs.TabPanel id="1">Content 1</Tabs.TabPanel>
        <Tabs.TabPanel id="2">Content 2</Tabs.TabPanel>
      </Tabs.TabPanels>
    </Tabs>
  </>
)
