import React, { useState, useEffect, useMemo } from 'react'
import * as Query from './Billing/Query'
import { useQuery } from '@apollo/client'

import Billing from './Billing'
import { useRouter } from 'next/router'

function Dues() {
  const router = useRouter()
  const { buildingID } = router.query

  const [categories, setCategories] = useState([])

  const { loading, data, error } = useQuery(Query.GET_ALLOWED_CATEGORY, {
    variables: {
      where: {
        accountId: buildingID,
        accountType: 'complex'
      },
      limit: 100
    }
  })

  useEffect(() => {
    if (categories?.categories) {
      router.push(
        `/dues/billing/${buildingID}/${categories[0]?.categories[0]?._id}`
      )
    } else {
      router.push(`/dues/billing/${buildingID}}`)
    }
  }, [buildingID, categories])

  useEffect(() => {
    if (!loading && data && !error) {
      console.log(data?.getAllowedBillCategory)
      setCategories(data?.getAllowedBillCategory?.data)
    }
  }, [loading, data, error])

  return <></>
}

export default Dues
