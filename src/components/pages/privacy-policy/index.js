import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import ReactHtmlParser from 'react-html-parser'

import showToast from '@app/utils/toast'

import styles from './index.module.css'

const GET_PAGE_QUERY = gql`
  query getPage($where: PageInput, $limit: Int, $offset: Int) {
    getPage(where: $where, limit: $limit, offset: $offset) {
      count
      limit
      offset
      post {
        _id
        title
        content
      }
    }
  }
`

const PrivacyPolicyComponent = () => {
  const [pageContent, setPageContent] = useState()

  const { loading, data, error } = useQuery(GET_PAGE_QUERY, {
    variables: {
      where: {
        title: 'Privacy Policy'
      }
    }
  })

  useEffect(() => {
    if (error) {
      errorHandler(error)
    }
    if (!loading && data) {
      setPageContent(data?.getPage?.post[0]?.content)
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
  console.log(pageContent)
  return (
    <>
      <div className={styles.PageContainer}>
        <div className={styles.PageContent}>{ReactHtmlParser(pageContent)}</div>
      </div>
    </>
  )
}

export default PrivacyPolicyComponent
