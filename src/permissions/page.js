import { useState, useMemo } from 'react'
import P from 'prop-types'
import NotFound from '@app/pages/404'
import check from './check'

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE

const Page = ({ route, page }) => {
  const [user] = useState(
    JSON.parse(localStorage.getItem('profile')) || undefined
  )

  const profile = useMemo(
    () => ({
      role: user?.accounts?.data[0]?.accountType
    }),
    [user]
  )

  return check(systemType, profile?.role, route) ? page : <NotFound />
}

Page.propTypes = {
  route: P.string,
  page: P.oneOfType([P.element, P.node])
}

export default Page
