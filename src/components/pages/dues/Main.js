import React, { useState, useEffect } from 'react'
import * as Query from './Billing/Query'
import { useQuery } from '@apollo/client'

import Billing from './Billing'
import { useRouter } from 'next/router'

import P from 'prop-types'

const _ = require('lodash')

function Dues({ complexId, bid }) {
  const router = useRouter()
  const { buildingID } = router.query

  const [categories, setCategories] = useState([])
  const [building, setBuilding] = useState([])

  const { loading, data, error } = useQuery(Query.GET_ALLOWED_CATEGORY, {
    variables: {
      where: {
        accountId: complexId,
        accountType: 'company'
      },
      limit: 100
    }
  })

  useEffect(() => {
    if ((buildingID || bid) && !_.isEmpty(categories)) {
      router.push(`/dues/billing/${buildingID || bid}/${categories[0]._id}`)
    }
  }, [categories])

  const {
    loading: loadingBuilding,
    data: dataBuilding,
    error: errorBuilding
  } = useQuery(Query.GET_BUILDINS, {
    variables: {
      where: {
        _id: buildingID || bid,
        status: 'active'
      },
      limit: 100
    }
  })

  useEffect(() => {
    if (!loading && data && !error) {
      const listOfCategory = data?.getAllowedBillCategory?.data.map(
        category => category.categories
      )

      setCategories(...listOfCategory)
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingBuilding && dataBuilding) {
      setBuilding(dataBuilding?.getBuildings?.data)
    }
  }, [loadingBuilding, dataBuilding, errorBuilding])

  return (
    <>
      {!_.isEmpty(building) && (buildingID || bid) && (
        <Billing
          categoriesBiling={categories}
          buildingName={building[0].name}
        />
      )}
    </>
  )
}

Dues.propTypes = {
  complexId: P.string,
  bid: P.string
}
export default Dues
