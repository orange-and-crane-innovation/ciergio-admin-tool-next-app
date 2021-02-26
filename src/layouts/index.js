import React from 'react'
import { useRouter } from 'next/router'
import Centered from '@app/layouts/centered'
import CenteredAuth from '@app/layouts/centered-auth'
import Layout from '@app/layouts/layout-1'

const Layouts = ({ children }) => {
  const router = useRouter()
  const { pathname } = { ...router }

  if (['/404', '/500'].includes(pathname)) {
    return <Centered>{children}</Centered>
  }

  if (
    [
      '/auth/login',
      '/auth/forgot-password',
      '/auth/reset',
      '/auth/reset/verify',
      '/auth/reset/password',
      '/auth/join/[code]'
    ].includes(pathname)
  ) {
    return <Centered>{children}</Centered>
  } else if (['/auth/manage', '/posts/view/[id]'].includes(pathname)) {
    return <CenteredAuth>{children}</CenteredAuth>
  } else {
    return <Layout>{children}</Layout>
  }
}

export default Layouts
