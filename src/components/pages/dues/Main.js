import React, { useState, useEffect } from 'react'
import * as Query from './Query'
import { useQuery } from '@apollo/client'

import Billing from './Billing'
import Overview from './Overview'

function Dues() {
  const [account, setAccount] = useState('')
  const [category, setCategory] = useState({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('profile'))
    const active = user?.accounts?.data.find(acc => acc.active === true)

    setAccount(active)
  }, [])

  const { loading, data, error, refetch } = useQuery(
    Query.GET_ALLOWED_CATEGORY,
    {
      variables: {
        where: {
          accountId: account?._id,
          accountType:
            account?.accountType === 'building_admin' ? 'building' : 'complex'
        },
        limit: 100
      }
    }
  )

  useEffect(() => {
    if (!loading && data) {
      setCategory(data?.getAllowedBillCategory)
      console.log(account)
    }
  }, [loading, data, error, refetch])

  return (
    <>
      {account?.accountType === 'building_admin' ? (
        <Billing
          categoryID={category?.id}
          buildingID={account?.building_id}
          categoryName={category?.name}
          accountID={account?._id}
          data={category?.data}
        />
      ) : (
        <Overview
          complexID={account?.complex?._id}
          complexName={account?.complex?.name}
          accountType={
            account.accountType !== '' &&
            account.accountType &&
            account.accountType.split('_')[0]
          }
        />
      )}
    </>
  )
}

export default Dues
