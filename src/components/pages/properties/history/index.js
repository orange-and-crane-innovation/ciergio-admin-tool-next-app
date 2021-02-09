/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'

import Card from '@app/components/card'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import PageLoader from '@app/components/page-loader'

import showToast from '@app/utils/toast'
import { DATE } from '@app/utils'
import { HISTORY_MESSAGES } from '@app/constants'

import styles from './index.module.css'

const GET_COMPANY_HISTORY_QUERY = gql`
  query getCompanyHistory(
    $where: GetCompanyHistoryParams
    $limit: Int
    $skip: Int
  ) {
    getCompanyHistory(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        date
        action
        data
        author {
          user {
            firstName
            lastName
          }
        }
        building {
          _id
          name
        }
        company {
          _id
          name
        }
        complex {
          _id
          name
        }
      }
    }
  }
`

const GET_COMPLEX_HISTORY_QUERY = gql`
  query getComplexHistory(
    $where: GetComplexHistoryParams
    $limit: Int
    $skip: Int
  ) {
    getComplexHistory(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        date
        action
        data
        author {
          user {
            firstName
            lastName
          }
        }
        building {
          _id
          name
        }
        company {
          _id
          name
        }
        complex {
          _id
          name
        }
      }
    }
  }
`

const GET_BUILDING_HISTORY_QUERY = gql`
  query getBuildingHistory(
    $where: GetBuildingHistoryParams
    $limit: Int
    $skip: Int
  ) {
    getBuildingHistory(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        date
        action
        data
        author {
          user {
            firstName
            lastName
          }
        }
        building {
          _id
          name
        }
        company {
          _id
          name
        }
        complex {
          _id
          name
        }
      }
    }
  }
`

const HistoryComponent = ({ type, header }) => {
  const router = useRouter()
  const [history, setHistory] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  let where

  switch (type) {
    case 'company':
      where = {
        companyId: router.query.id
      }
      break
    case 'complex':
      where = {
        complexId: router.query.id
      }
      break
    default:
      where = {
        buildingId: router.query.id
      }
      break
  }

  const { loading, data, error, refetch } = useQuery(
    type === 'company'
      ? GET_COMPANY_HISTORY_QUERY
      : type === 'complex'
      ? GET_COMPLEX_HISTORY_QUERY
      : GET_BUILDING_HISTORY_QUERY,
    {
      enabled: false,
      variables: {
        where: where,
        limit: limitPage,
        skip: offsetPage
      }
    }
  )

  useEffect(() => {
    router.replace(`/properties/${type}/${router.query.id}/history`)
    refetch()
  }, [])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data) {
        let finalData
        switch (type) {
          case 'company':
            finalData = data?.getCompanyHistory
            break
          case 'complex':
            finalData = data?.getComplexHistory
            break
          default:
            finalData = data?.getBuildingHistory
            break
        }

        const tableData = {
          count: finalData?.count || 0,
          limit: finalData?.limit || 0,
          offset: finalData?.skip || 0,
          data:
            finalData?.data?.map(item => {
              const activity = JSON.parse(item.data)
              const author =
                item?.author && item?.author?.user
                  ? `${item?.author?.user?.firstName} ${item?.author?.user?.lastName}`
                  : 'Unknown User'

              return {
                date: DATE.toFriendlyDateTime(item?.date),
                user: author,
                property:
                  item?.building?.name ??
                  item?.complex?.name ??
                  item?.company?.name,
                activity:
                  (HISTORY_MESSAGES[item.action] &&
                    HISTORY_MESSAGES[item.action](activity)) ||
                  'No activity'
              }
            }) || null
        }

        setHistory(tableData)
      }
    }
  }, [loading, data, error])

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(e * limitPage - 10)
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
  }

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError) {
        if (networkError?.result?.errors[0]?.code === 4000) {
          showToast('danger', 'Category name already exists')
        } else {
          showToast('danger', errors?.networkError?.result?.errors[0]?.message)
        }
      }
    }
  }

  return (
    <div className={styles.PageContainer}>
      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span className={styles.CardHeader}>Recent Activity</span>
          </div>
        }
        content={
          loading ? (
            <PageLoader />
          ) : (
            history && <Table rowNames={header} items={history} />
          )
        }
      />
      {history && history.count > 10 && (
        <Pagination
          items={history}
          activePage={activePage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  )
}

HistoryComponent.propTypes = {
  type: P.string.isRequired,
  header: P.array.isRequired
}

export default HistoryComponent
