import React, { useState, useEffect } from 'react'
import * as Query from './Billing/Query'
import { useQuery } from '@apollo/client'

import Billing from './Billing'
import { useRouter } from 'next/router'
import { BsInfoCircle } from 'react-icons/bs'

const _ = require('lodash')

function Dues() {
  const router = useRouter()
  const { buildingID } = router.query

  const [categories, setCategories] = useState([])
  const [building, setBuilding] = useState([])

  const { loading, data, error } = useQuery(Query.GET_ALLOWED_CATEGORY, {
    variables: {
      where: {
        accountType: 'building'
      },
      limit: 100
    }
  })

  const {
    loading: loadingBuilding,
    data: dataBuilding,
    error: errorBuilding
  } = useQuery(Query.GET_BUILDINS, {
    variables: {
      where: {
        _id: buildingID,
        status: 'active'
      },
      limit: 100
    }
  })

  useEffect(() => {
    if (!loadingBuilding && dataBuilding) {
      setBuilding(dataBuilding?.getBuildings?.data)
    }
  }, [loadingBuilding, dataBuilding, errorBuilding])

  useEffect(() => {
    if (!loading && data && !error) {
      const catgry = data?.getAllowedBillCategory?.data.map(category => {
        return category.categories
      })

      setCategories(...catgry)
    }
  }, [loading, data, error])

  return (
    <>
      {!_.isEmpty(categories) && !_.isEmpty(building) && buildingID ? (
        <Billing
          categoriesBiling={categories}
          buildingName={building[0].name}
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center content-center">
          <div className="w-1/4 flex-col justify-center items-center content-center text-center">
            <BsInfoCircle
              size="100"
              className="w-full text-center"
              fill="rgb(238,52,12)"
            />
            <h3 className="text-5xl">
              Billing has not been setup. Please contact your administrator
            </h3>
          </div>
        </div>
      )}
    </>
  )
}

export default Dues
