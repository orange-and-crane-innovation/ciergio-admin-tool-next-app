import { useState, useMemo } from 'react'
import P from 'prop-types'
import NotFound from '@app/pages/404'

import rules from './rules'

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE

const check = (type, role, action) => {
  const permissions = rules[type][role].allowedRoutes

  if (!permissions) {
    console.log("ERROR: one of the provided params don't exist!")
    return false
  }

  if (permissions.includes(action)) {
    return true
  }

  return false
}

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

  return check(systemType, profile?.role, route) ? (
    page
  ) : (
    <div className="w-full flex justify-center mt-10">
      <NotFound />
    </div>
  )
}

Page.propTypes = {
  route: P.string,
  page: P.oneOfType([P.element, P.node])
}

export default Page
