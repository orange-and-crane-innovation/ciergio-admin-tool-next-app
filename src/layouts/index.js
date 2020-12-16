import React from 'react'
import { useRouter } from 'next/router'
import Centered from '@app/layouts/centered'
import Layout from '@app/layouts/layout-1'

const Layouts = ({ children }) => {
  const router = useRouter()
  const { pathname } = { ...router }

  if (['/404', '/500'].includes(pathname)) {
    return <Centered>{children}</Centered>
  }

  if (['/auth/login'].includes(pathname)) {
    return <Centered>{children}</Centered>
  } else {
    return <Layout>{children}</Layout>
  }
}

export default Layouts
