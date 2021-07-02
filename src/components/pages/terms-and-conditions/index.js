import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import ReactHtmlParser from 'react-html-parser'
import { FiFileText } from 'react-icons/fi'

import PageLoader from '@app/components/page-loader'
import showToast from '@app/utils/toast'

import NotifCard from '@app/components/globals/NotifCard'

import styles from './index.module.css'

const GET_TERMS_AND_CONDITIONS_QUERY = gql`
  query getTermsAndCondition($complexId: String) {
    getTermsAndCondition(complexId: $complexId) {
      termsAndConditions
      createdAt
      updatedAt
    }
  }
`

const TermsConditionsComponent = () => {
  const router = useRouter()
  const [pageContent, setPageContent] = useState()

  const { loading, data, error } = useQuery(GET_TERMS_AND_CONDITIONS_QUERY, {
    skip: router.query.id === undefined,
    variables: {
      complexId: router.query.id
    }
  })

  useEffect(() => {
    if (error) {
      errorHandler(error)
    }
    if (!loading && data) {
      setPageContent(data?.getTermsAndCondition?.termsAndConditions)
    }
  }, [loading, data, error])

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
    <>
      <div className={styles.PageContainer}>
        <div className={styles.PageContent}>
          {loading ? (
            <PageLoader />
          ) : pageContent ? (
            ReactHtmlParser(pageContent)
          ) : error ? (
            <NotifCard
              icon={<FiFileText />}
              header="Terms and Conditions Not Found"
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default TermsConditionsComponent
