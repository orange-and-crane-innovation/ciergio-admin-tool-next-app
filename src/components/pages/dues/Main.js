import React, { useState, useEffect } from 'react'
import * as Query from './Billing/Query'
import { useQuery } from '@apollo/client'

import Billing from './Billing'
import Overview from './Overview'
import { useRouter } from 'next/router'

function Dues() {
  const router = useRouter()
  const { buildingID } = router.query
  const [account, setAccount] = useState('')
  const user = JSON.parse(localStorage.getItem('profile'))
  const [categories, setCategories] = useState([])

  const { loading, data, error } = useQuery(Query.GET_ALLOWED_CATEGORY, {
    variables: {
      where: {
        accountId: user?.accounts?.data[0]?.complex?._id,
        accountType: 'complex'
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
      setCategories(data?.getAllowedBillCategory?.data)
    }
  }, [loading, data, error])
}

export default Dues
