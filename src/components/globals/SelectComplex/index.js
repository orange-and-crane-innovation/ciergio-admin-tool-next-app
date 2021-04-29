import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'

import FormSelect from '@app/components/forms/form-select'

import styles from './index.module.css'

const GET_COMPLEXES_QUERY = gql`
  query getComplexes($where: GetComplexesParams, $limit: Int, $skip: Int) {
    getComplexes(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
      }
    }
  }
`

const SelectComplexComponent = ({
  type,
  userType,
  companyId,
  selected,
  error,
  onChange,
  onClear
}) => {
  const [lists, setLists] = useState()

  const {
    loading: loadingComplexes,
    data: dataComplexes,
    error: errorComplexes
  } = useQuery(GET_COMPLEXES_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: type,
        companyId: companyId
      },
      limit: 500,
      skip: 0
    }
  })

  useEffect(() => {
    if (!loadingComplexes && dataComplexes) {
      const dataLists = dataComplexes?.getComplexes?.data.map((item, index) => {
        return {
          value: item._id,
          label: item.name
        }
      })
      setLists(dataLists)
    }
  }, [loadingComplexes, dataComplexes, errorComplexes])

  return (
    <div className={styles.SelectCompanyContainer}>
      <FormSelect
        name="complexIds"
        placeholder={'Select a Complex'}
        valueholder="Complex"
        noOptionsMessage={() => 'No item found.'}
        defaultValue={selected}
        options={lists || []}
        loading={loadingComplexes}
        onChange={onChange}
        onClear={onClear}
        isMulti={true}
      />
    </div>
  )
}

SelectComplexComponent.propTypes = {
  type: PropTypes.string,
  userType: PropTypes.string,
  companyId: PropTypes.string,
  selected: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
}

export default SelectComplexComponent
