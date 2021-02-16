import React, { useState, useEffect } from 'react'
import * as Query from './Query'
import { useQuery } from '@apollo/client'
import styles from './main.module.css'

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
    }
  }, [loading, data, error, refetch])

  return (
    <div className={styles.BillingContainer}>
      <h1 className={styles.BillingHeader}>{account?.building?.name}</h1>
      {account?.accountType === 'building_admin' ? (
        <Billing category={category} account={account} />
      ) : (
        <Overview complexID={account?.complex?._id} />
      )}
    </div>
  )
}

export default Dues
