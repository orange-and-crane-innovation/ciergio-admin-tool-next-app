import { useState, useMemo } from 'react'
import P from 'prop-types'
import NotFound from '@app/pages/404'
import rules from './rules'

const _ = require('lodash')

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE

const check = (type, role, route, nestedRoute) => {
  const allowedPageRoutes = rules[type][role].allowedRoutes
  const allowedNestedPageRoutes =
    nestedRoute && rules[type][role].allowedNestedRoutes

  if (!allowedPageRoutes) {
    console.log("ERROR: one of the provided params don't exist!")
    return false
  }

  if (!_.isEmpty(allowedNestedPageRoutes)) {
    if (
      _.includes(allowedPageRoutes, route) &&
      _.includes(allowedNestedPageRoutes, nestedRoute)
    ) {
      return true
    }
  } else {
    if (_.includes(allowedPageRoutes, route)) {
      return true
    }
  }

  return false
}

const Page = ({ route, nestedRoute, page }) => {
  console.log(nestedRoute)
  const [user] = useState(
    JSON.parse(localStorage.getItem('profile')) || undefined
  )

  const profile = useMemo(
    () => ({
      role: user?.accounts?.data[0]?.accountType
    }),
    [user]
  )

  return check(systemType, profile?.role, route, nestedRoute) ? (
    page
  ) : (
    <div className="w-full flex justify-center mt-10">
      <NotFound />
    </div>
  )
}

Page.defaultProps = {
  nestedRoute: P.null
}

Page.propTypes = {
  route: P.string,
  nestedRoute: P.oneOfType([P.null, P.string]),
  page: P.oneOfType([P.element, P.node])
}

export default Page
