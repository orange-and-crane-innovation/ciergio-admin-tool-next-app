import React, { useState, useEffect } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'

import FormSelect from '@app/components/forms/form-select'

import { ACCOUNT_TYPES } from '@app/constants'

import styles from './index.module.css'

const GET_POST_CATEGORY_QUERY = gql`
  query getPostCategory($where: PostCategoryInput, $limit: Int, $offset: Int) {
    getPostCategory(where: $where, limit: $limit, offset: $offset) {
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
  onClear
}) => {
  const [lists, setLists] = useState()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const company = user?.accounts?.data[0]?.company?._id
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const isSystemPray = system === 'pray'

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
    if (isSystemPray || accountType === ACCOUNT_TYPES.SUP.value) {
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
      setLists(dataLists)
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
  onClear: PropTypes.func
}

export default SelectCategoryComponent
