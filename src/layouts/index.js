import React from 'react'
import { useRouter } from 'next/router'
import Centered from '@app/layouts/centered'
import CenteredAuth from '@app/layouts/centered-auth'
import Layout from '@app/layouts/layout-1'
import Public from '@app/layouts/public'

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
      '/auth/reset/password'
    ].includes(pathname)
  ) {
    return <Centered>{children}</Centered>
  } else if (
    [
      '/auth/join/[code]',
      '/auth/verify-email/[code]',
      '/terms-and-conditions',
      '/privacy-policy',
      '/unsubscribe/[id]',
      '/public-posts/view/[id]/[aid]',
      '/public-qr-posts/view/[id]'
    ].includes(pathname)
  ) {
    return <Public>{children}</Public>
  } else if (
    [
      '/auth/manage',
      '/posts/view/[id]',
      '/attractions-events/view/[id]',
      '/qr-code/view/[id]',
      '/daily-readings/view/[id]'
    ].includes(pathname)
  ) {
    return <CenteredAuth>{children}</CenteredAuth>
  } else {
    return <Layout>{children}</Layout>
  }
}

export default Layouts
