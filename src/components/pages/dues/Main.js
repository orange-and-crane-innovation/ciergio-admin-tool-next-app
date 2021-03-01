import React, { useState, useEffect, useMemo } from 'react'
import * as Query from './Billing/Query'
import { useQuery } from '@apollo/client'

import Billing from './Billing'
import Overview from './Overview'
import { useRouter } from 'next/router'

function Dues() {
  const router = useRouter()
  const { buildingID } = router.query

  const user = JSON.parse(localStorage.getItem('profile'))
  const [categories, setCategories] = useState([])

  const { loading, data, error } = useQuery(Query.GET_ALLOWED_CATEGORY, {
    variables: {
      where: {
        accountType: 'building'
      },
      limit: 100
    }
  })

  useEffect(() => {
    router.push(
      `/dues/billing/${buildingID}/${categories[0]?.categories[0]?._id}`
    )
  }, [buildingID, categories])

  useEffect(() => {
    if (!loading && data && !error) {
      console.log(data?.getAllowedBillCategory)
      setCategories(data?.getAllowedBillCategory?.data)
    }
  }, [loading, data, error])

  useEffect(() => {
    console.log(categories[0]?.categories)
  }, [categories])

  return <></>
}

export default Dues
