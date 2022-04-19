import React, { useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'

import { ACCOUNT_TYPES } from '@app/constants'
import FormSelect from '@app/components/forms/form-select'
import PropTypes from 'prop-types'
import styles from './index.module.css'

// we will initialize here since we will get the categories from the backend we will just match all of these to the list from the backend
const PASTORAL_WORKS_CATEGORY_ORDER = [
  'Parish Events',
  'Food Program',
  'Educational Program',
  'Youth Events',
  'For Vacation',
  'Special Outreach',
  'Calamities',
  'Media Program',
  'Prayers',
  'IT App Info/Support'
]

const GET_POST_CATEGORY_QUERY = gql`
  query getPostCategory(
    $where: PostCategoryInput
    $limit: Int
    $offset: Int
    $sort: PostCategorySort
  ) {
    getPostCategory(
      where: $where
      limit: $limit
      offset: $offset
      sort: $sort
    ) {
      count
      category {
        _id
        name
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
        _id
        accountId
        accountType
        categories {
          _id
          name
          status
          defaultImage
          type
        }
      }
    }
  }
`

const SelectCategoryComponent = ({
  type,
  selected,
  error,
  disabled,
  placeholder,
  onChange,
  onClear,
  isPastoralWorksPage
}) => {
  const [lists, setLists] = useState()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const company = user?.accounts?.data[0]?.company?._id
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const isSystemPray = system === 'pray'
  const isSystemCircle = system === 'circle'

  const [
    getCategories,
    { loading: loadingCategory, data: dataCategory, error: errorCategory }
  ] = useLazyQuery(GET_POST_CATEGORY_QUERY, {
    enabled: false,
    fetchPolicy: 'network-only',
    variables: {
      where: {
        type: type
      },
      sort: {
        by: 'name',
        order: 'asc'
      },
      limit: 500,
      offset: 0
    }
  })

  const [
    getAllowedCategories,
    {
      loading: loadingAllowedCategory,
      data: dataAllowedCategory,
      error: errorAllowedCategory
    }
  ] = useLazyQuery(GET_ALLLOWED_POST_CATEGORY_QUERY, {
    enabled: false,
    fetchPolicy: 'network-only',
    variables: {
      where: {
        settings: {
          accountType: 'company',
          accountId: company
        },
        category: {
          type: type
        }
      },
      limit: 500,
      offset: 0
    }
  })

  useEffect(() => {
    if (
      isSystemPray ||
      isSystemCircle ||
      accountType === ACCOUNT_TYPES.SUP.value
    ) {
      getCategories()
    } else {
      getAllowedCategories()
    }
  }, [])

  useEffect(() => {
    if (
      (!loadingCategory || !loadingAllowedCategory) &&
      (dataCategory || dataAllowedCategory)
    ) {
      const data =
        dataCategory?.getPostCategory?.category ||
        dataAllowedCategory?.getAllowedPostCategory?.data[0]?.categories
      const dataLists = data?.map((item, index) => {
        return {
          value: item._id,
          label: item.name
        }
      })

      const sorted = []
      PASTORAL_WORKS_CATEGORY_ORDER.forEach((ct, index) => {
        const isExist = dataLists.find(dl => ct === dl.label)

        if (isExist) {
          sorted.push(isExist)
        }
      })

      const unsorted = dataLists.filter(dl => {
        const isExist = sorted.find(s => s.label === dl.label)

        return !isExist && dl
      })

      const dataListSorted = [...sorted, ...unsorted]

      setLists(!isPastoralWorksPage ? dataLists : dataListSorted)
    }
  }, [
    loadingCategory,
    dataCategory,
    errorCategory,
    loadingAllowedCategory,
    dataAllowedCategory,
    errorAllowedCategory
  ])

  return (
    <div className={styles.SelectCategoryContainer}>
      <FormSelect
        name="category"
        placeholder={placeholder}
        noOptionsMessage={() => 'No item found.'}
        defaultValue={
          lists ? lists.filter(item => item.value === selected) : null
        }
        value={lists ? lists.filter(item => item.value === selected) : null}
        error={error}
        options={lists || []}
        disabled={disabled}
        onChange={onChange}
        onClear={onClear}
        isClearable
        loading={loadingCategory || loadingAllowedCategory}
      />
    </div>
  )
}

SelectCategoryComponent.propTypes = {
  type: PropTypes.string,
  selected: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  isPastoralWorksPage: PropTypes.bool
}

export default SelectCategoryComponent
