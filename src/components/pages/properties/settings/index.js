/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'
import _ from 'underscore'

import Card from '@app/components/card'
import Checkbox from '@app/components/forms/form-checkbox'
import PageLoader from '@app/components/page-loader'

import showToast from '@app/utils/toast'

import styles from './index.module.css'

const GET_POST_CATEGORY_QUERY = gql`
  query getPostCategory($where: PostCategoryInput, $limit: Int, $offset: Int) {
    getPostCategory(where: $where, limit: $limit, offset: $offset) {
      count
      category {
        _id
        name
        type
      }
    }
  }
`
const GET_ALLLOWED_POST_CATEGORY_QUERY = gql`
  query getAllowedPostCategory(
    $where: AllowedPostCategoryInput
    $limit: Int
    $offset: Int
  ) {
    getAllowedPostCategory(where: $where, limit: $limit, offset: $offset) {
      count
      limit
      offset
      count
      data {
        categories {
          _id
          name
          type
        }
      }
    }
  }
`

const ADD_CATEGORY_QUERY = gql`
  mutation (
    $accountType: CategoryAccountType
    $accountId: String
    $categoryIds: [String]
  ) {
    addPostCategory(
      accountType: $accountType
      accountId: $accountId
      categoryIds: $categoryIds
    ) {
      _id
      processId
      message
    }
  }
`

const REMOVE_CATEGORY_QUERY = gql`
  mutation (
    $accountType: CategoryAccountType
    $accountId: String
    $categoryIds: [String]
  ) {
    removePostCategory(
      accountType: $accountType
      accountId: $accountId
      categoryIds: $categoryIds
    ) {
      _id
      processId
      message
    }
  }
`

const CompanySettingsComponent = ({ type }) => {
  const router = useRouter()
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const [categoryLists, setCategoryLists] = useState([])
  const [allowedCategoryLists, setAllowedCategoryLists] = useState([])
  const isSystemPray = system === 'pray'

  const {
    loading: loadingCategory,
    data: dataCategory,
    error: errorCategory,
    refetch: refetchCategory
  } = useQuery(GET_POST_CATEGORY_QUERY, {
    enabled: false,
    variables: {
      limit: 500,
      offset: 0
    }
  })

  const {
    loading: loadingAllowedCategory,
    data: dataAllowedCategory,
    error: errorAllowedCategory,
    refetch: refetchAllowedCategory
  } = useQuery(GET_ALLLOWED_POST_CATEGORY_QUERY, {
    enabled: false,
    variables: {
      where: {
        settings: {
          accountType: 'company',
          accountId: router.query.id
        }
      },
      limit: 500,
      offset: 0
    }
  })

  const [
    addCategory,
    {
      loading: loadingAddCategory,
      called: calledAddCategory,
      data: dataAddCategory,
      error: errorAddCategory
    }
  ] = useMutation(ADD_CATEGORY_QUERY)

  const [
    removeCategory,
    {
      loading: loadingRemoveCategory,
      called: calledRemoveCategory,
      data: dataRemoveCategory,
      error: errorRemoveCategory
    }
  ] = useMutation(REMOVE_CATEGORY_QUERY)

  useEffect(() => {
    router.replace(`/properties/${type}/${router.query.id}/settings`)
    refetchCategory()
    refetchAllowedCategory()
  }, [])

  useEffect(() => {
    if (!loadingCategory) {
      if (errorCategory) {
        errorHandler(errorCategory)
      } else if (dataCategory) {
        const groupedCat = _.mapObject(
          _.groupBy(dataCategory?.getPostCategory?.category, 'type'),
          item => _.sortBy(item, 'name')
        )
        setCategoryLists(groupedCat)
      }
    }
  }, [loadingCategory, dataCategory, errorCategory])

  useEffect(() => {
    if (!loadingAllowedCategory) {
      if (errorAllowedCategory) {
        errorHandler(errorAllowedCategory)
      } else if (dataAllowedCategory) {
        const groupedCat = _.mapObject(
          _.groupBy(
            dataAllowedCategory?.getAllowedPostCategory?.data[0]?.categories,
            'type'
          ),
          item => _.sortBy(item, 'name')
        )
        setAllowedCategoryLists(groupedCat)
      }
    }
  }, [loadingAllowedCategory, dataAllowedCategory, errorAllowedCategory])

  useEffect(() => {
    if (!loadingAddCategory) {
      if (errorAddCategory) {
        errorHandler(errorAddCategory)
      }
      if (calledAddCategory && dataAddCategory) {
        showToast('success', 'You have successfully updated a setting.')
      }
      refetchAllowedCategory()
    }
  }, [loadingAddCategory, calledAddCategory, dataAddCategory, errorAddCategory])

  useEffect(() => {
    if (!loadingRemoveCategory) {
      if (errorRemoveCategory) {
        errorHandler(errorRemoveCategory)
      }
      if (calledRemoveCategory && dataRemoveCategory) {
        showToast('success', 'You have successfully updated a setting.')
      }
      refetchAllowedCategory()
    }
  }, [
    loadingRemoveCategory,
    calledRemoveCategory,
    dataRemoveCategory,
    errorRemoveCategory
  ])

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

  const onSettingsChanged = async data => {
    const selected = data.target.value
    const isChecked = data.target.checked
    const item = {
      accountType: 'company',
      accountId: router.query.id,
      categoryIds: [selected]
    }

    try {
      if (isChecked) {
        await addCategory({ variables: item })
      } else {
        await removeCategory({ variables: item })
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={styles.PageContainer}>
      <div className="w-full text-base lg:w-3/4">
        <div className="text-lg font-bold my-4">General</div>
        <div className="text-lg font-bold my-4">Features</div>
        <div>
          Every property in this company will have access to the enabled
          features.
        </div>

        <br />
        <div className="text-lg font-bold my-4">Bulletin Board</div>
        <Card
          noPadding
          content={
            <div className="p-4">
              <div className="text-lg font-bold mb-4">
                Bulletin Board Categories
              </div>
              <div>
                These will be the available categories for everyone in your
                property.
              </div>
              <div>
                {loadingCategory || loadingAllowedCategory ? (
                  <PageLoader />
                ) : (
                  <label className="inline-flex items-center mt-3">
                    <ul className={styles.CheckboxListContainer}>
                      {(categoryLists?.post?.length > 0 ||
                        allowedCategoryLists?.post?.length > 0) &&
                        categoryLists?.post?.map((item, index) => {
                          const isChecked = (allowedCategoryLists?.post ?? [])
                            .map(item2 => item2._id)
                            .includes(item._id)

                          return (
                            <li key={index}>
                              <Checkbox
                                primary
                                id={`post-${index}`}
                                name="post_category"
                                label={item.name}
                                value={item._id}
                                isChecked={isChecked}
                                onChange={onSettingsChanged}
                              />
                            </li>
                          )
                        })}
                    </ul>
                  </label>
                )}
              </div>
            </div>
          }
        />

        <br />
        <div className="text-lg font-bold my-4">
          {isSystemPray ? 'Prayer Requests' : 'Maintenance and Repairs'}
        </div>
        <Card
          noPadding
          content={
            <div className="p-4">
              <div className="text-lg font-bold mb-4">
                {`${
                  isSystemPray ? 'Prayer Requests' : 'Maintenance and Repairs'
                } Categories`}
              </div>
              <div>
                These will be the available categories for everyone in your
                property.
              </div>
              <div>
                {loadingCategory || loadingAllowedCategory ? (
                  <PageLoader />
                ) : (
                  <label className="inline-flex items-center mt-3">
                    <ul className={styles.CheckboxListContainer}>
                      {(categoryLists?.issue?.length > 0 ||
                        allowedCategoryLists?.issue?.length > 0) &&
                        categoryLists?.issue?.map((item, index) => {
                          const isChecked = (allowedCategoryLists?.issue ?? [])
                            .map(item2 => item2._id)
                            .includes(item._id)

                          return (
                            <li key={index}>
                              <Checkbox
                                primary
                                id={`issue-${index}`}
                                name="issue_category"
                                label={item.name}
                                value={item._id}
                                isChecked={isChecked}
                                onChange={onSettingsChanged}
                              />
                            </li>
                          )
                        })}
                    </ul>
                  </label>
                )}
              </div>
            </div>
          }
        />

        <br />
        <div className="text-lg font-bold my-4">Flash Notifications</div>
        <Card
          noPadding
          content={
            <div className="p-4">
              <div className="text-lg font-bold mb-4">
                Flash Notifications Categories
              </div>
              <div>
                These will be the available categories for everyone in your
                property.
              </div>
              <div>
                {loadingCategory || loadingAllowedCategory ? (
                  <PageLoader />
                ) : (
                  <label className="inline-flex items-center mt-3">
                    <ul className={styles.CheckboxListContainer}>
                      {(categoryLists?.flash?.length > 0 ||
                        allowedCategoryLists?.flash?.length > 0) &&
                        categoryLists?.flash?.map((item, index) => {
                          const isChecked = (allowedCategoryLists?.flash ?? [])
                            .map(item2 => item2._id)
                            .includes(item._id)

                          return (
                            <li key={index}>
                              <Checkbox
                                primary
                                id={`flash-${index}`}
                                name="flash_category"
                                label={item.name}
                                value={item._id}
                                isChecked={isChecked}
                                onChange={onSettingsChanged}
                              />
                            </li>
                          )
                        })}
                    </ul>
                  </label>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}

CompanySettingsComponent.propTypes = {
  type: P.string.isRequired
}

export default CompanySettingsComponent
