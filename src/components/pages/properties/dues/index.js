/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'
import orderBy from 'lodash.orderby'
import moment from 'moment'
import { FaRegEye } from 'react-icons/fa'

import Card from '@app/components/card'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import PageLoader from '@app/components/page-loader'

import showToast from '@app/utils/toast'
import { DATE } from '@app/utils'

import styles from './index.module.css'

const GET_MY_DUES_QUERY = gql`
  query getMyDues($where: DuesQueryInput, $limit: Int, $offset: Int) {
    getMyDues(where: $where, limit: $limit, offset: $offset) {
      count
      limit
      offset
      data {
        _id
        dueDate
        sent
        sentAt
        settledAt
        category {
          name
        }
        period {
          month
          year
        }
        views {
          count
        }
        attachment {
          fileUrl
        }
      }
    }
  }
`

const DuesComponent = ({ unit, header }) => {
  const router = useRouter()
  const [dues, setDues] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)

  const { loading, data, error, refetch } = useQuery(GET_MY_DUES_QUERY, {
    variables: {
      where: {
        unitId: router.query.id
      },
      limit: limitPage,
      offset: offsetPage
    }
  })

  useEffect(() => {
    router.replace(`/properties/unit/${router.query.id}/dues`)
    refetch()
  }, [])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data) {
        const finalData = data?.getMyDues?.data
        const tableData = {
          count: finalData?.count || 0,
          limit: finalData?.limit || 0,
          offset: finalData?.offset || 0,
          data:
            finalData && finalData.length > 0
              ? orderBy(
                  finalData,
                  ['period.year', 'period.month'],
                  ['desc', 'asc']
                ).map(item => {
                  const period = moment({
                    month: item.period.month - 1,
                    y: item.period.year
                  })
                  const dueDate = moment(new Date(item?.dueDate))
                  return {
                    date: period.format('MMMM YYYY'),
                    count:
                      item?.views.count && item?.views.count > 0 ? (
                        <FaRegEye className="text-neutral-500" />
                      ) : null,
                    category: item?.category?.name || 'Unknown Bill',
                    due: DATE.toFriendlyShortDate(dueDate),
                    file: item?.attachment?.fileUrl ? (
                      <a
                        href={item?.attachment?.fileUrl}
                        target="_blank"
                        className={styles.ContentLink}
                      >
                        View File
                      </a>
                    ) : null
                  }
                })
              : null
        }

        setDues(tableData)
      }
    }
  }, [loading, data, error])

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
  }

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
  }

  return (
    <div className={styles.PageContainer}>
      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span
              className={styles.CardHeader}
            >{`Unit ${unit?.name}'s Dues`}</span>
          </div>
        }
        content={
          loading ? (
            <PageLoader />
          ) : (
            dues && <Table rowNames={header} items={dues} />
          )
        }
      />
      {dues && dues.count > 10 && (
        <Pagination
          items={dues}
          activePage={activePage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  )
}

DuesComponent.propTypes = {
  unit: P.object,
  header: P.array.isRequired
}

export default DuesComponent
