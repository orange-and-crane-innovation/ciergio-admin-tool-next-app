import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { FaSpinner } from 'react-icons/fa'

import FormSelect from '@app/components/forms/form-select'

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
  userType,
  selected,
  onChange,
  onClear
}) => {
  const [lists, setLists] = useState()

  const {
    loading: loadingCategory,
    data: dataCategory,
    error: errorCategory,
    refetch: refetchCategory
  } = useQuery(GET_POST_CATEGORY_QUERY, {
    enabled: false,
    variables: {
      where: {
        type: type
      },
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
        category: {
          type: 'post'
        }
      },
      limit: 500,
      offset: 0
    }
  })

  useEffect(() => {
    if (userType === 'administrator') {
      refetchCategory()
    } else {
      refetchAllowedCategory()
    }
  }, [userType, refetchCategory, refetchAllowedCategory])

  useEffect(() => {
    if (
      (!loadingCategory || !loadingAllowedCategory) &&
      (dataCategory || dataAllowedCategory)
    ) {
      const dataLists = [{ value: '', label: 'All Categories' }]

      dataCategory?.getPostCategory?.category.map((item, index) => {
        return dataLists.push({
          value: item._id,
          label: item.name
        })
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

  if (loadingCategory || loadingAllowedCategory) {
    return (
      <div className={styles.SelectCategorySpinnerContainer}>
        <FaSpinner className="icon-spin" />
      </div>
    )
  }

  return (
    <FormSelect
      value={selected}
      options={lists || []}
      onChange={onChange}
      onClear={onClear}
    />
  )
}

SelectCategoryComponent.propTypes = {
  type: PropTypes.string,
  userType: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
}

export default SelectCategoryComponent