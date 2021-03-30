/* eslint-disable react/jsx-key */
import React from 'react'
import { useRouter } from 'next/router'

import Tabs from '@app/components/tabs'

import AllPostPage from './AllPosts'
import MyPostPage from './MyPosts'
import TrashPage from './Trashed'

import styles from './Main.module.css'

const PostComponent = () => {
  const router = useRouter()
  const isAttractionsEventsPage = router.pathname === '/attractions-events'
  const isQRCodePage = router.pathname === '/qr-code'
  const isDailyReadingsPage = router.pathname === '/daily-readings'
  const pageName = isAttractionsEventsPage
    ? 'Attractions & Events'
    : isQRCodePage
    ? 'QR Code'
    : isDailyReadingsPage
    ? 'Daily Readings'
    : 'Bulletin Board'
  const tabName = isQRCodePage
    ? 'Active QR Posts'
    : isDailyReadingsPage
    ? 'Daily Readings'
    : 'Bulletin Board'

  return (
    <div className={styles.PostContainer}>
      <h1 className={styles.PostHeader}>{pageName}</h1>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">{tabName}</Tabs.TabLabel>
          <Tabs.TabLabel id="2">My Posts</Tabs.TabLabel>
          <Tabs.TabLabel id="3">Trash</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <AllPostPage />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <MyPostPage />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <TrashPage />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default PostComponent
