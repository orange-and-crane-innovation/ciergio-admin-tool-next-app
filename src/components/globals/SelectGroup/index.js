import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'

import FormSelect from '@app/components/forms/form-select'

import styles from './index.module.css'

const GET_GROUP_QUERY = gql`
  query($where: getCompanyGroupsParams, $skip: Int, $limit: Int) {
    getCompanyGroups(where: $where, skip: $skip, limit: $limit) {
      data {
        _id
        name
        status
        companyId
      }
      limit
      skip
      count
    }
  }
`

const SelectGroupComponent = ({
  type,
  companyId,
  selected,
  error,
  onChange,
  onClear,
  placeholder
}) => {
  const [lists, setLists] = useState()

  const {
    loading: loadingGroups,
    data: getCompanyGroups,
    error: errorGroups
  } = useQuery(GET_GROUP_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: type,
        companyId: companyId
      },
      limit: 1000,
      skip: 0
    }
  })

  useEffect(() => {
    console.log(
      'dataComplexesdataComplexes',
      getCompanyGroups?.getCompanyGroups
    )
    if (!loadingGroups && getCompanyGroups) {
      const dataLists = getCompanyGroups?.getCompanyGroups?.data?.map(
        (item, index) => {
          return {
            value: item._id,
            label: item.name
          }
        }
      )
      setLists(dataLists)
    }
  }, [loadingGroups, getCompanyGroups, errorGroups])

  return (
    <div className={styles.SelectCompanyContainer}>
      <FormSelect
        name="complexIds"
        placeholder={placeholder || 'Select groups(s)'}
        valueholder="Complex"
        noOptionsMessage={() => 'No item found.'}
        defaultValue={selected}
        options={lists || []}
        loading={loadingGroups}
        onChange={onChange}
        onClear={onClear}
        isMulti={true}
      />
    </div>
  )
}

SelectGroupComponent.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  userType: PropTypes.string,
  companyId: PropTypes.string,
  selected: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
}

export default SelectGroupComponent
