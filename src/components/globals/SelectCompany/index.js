import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { FaSpinner } from 'react-icons/fa'

import FormSelect from '@app/components/forms/form-select'

import styles from './index.module.css'

const GET_COMPANIES_QUERY = gql`
  query getCompanies($where: GetCompaniesParams, $limit: Int, $skip: Int) {
    getCompanies(where: $where, limit: $limit, skip: $skip) {
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

const SelectCategoryComponent = ({
  type,
  userType,
  selected,
  error,
  onChange,
  onClear
}) => {
  const [lists, setLists] = useState()

  const {
    loading: loadingCompanies,
    data: dataCompanies,
    error: errorCompanies
  } = useQuery(GET_COMPANIES_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: type
      },
      limit: 500,
      skip: 0
    }
  })

  useEffect(() => {
    if (!loadingCompanies && dataCompanies) {
      const dataLists = dataCompanies?.getCompanies?.data.map((item, index) => {
        return {
          value: item._id,
          label: item.name
        }
      })
      setLists(dataLists)
    }
  }, [loadingCompanies, dataCompanies, errorCompanies])

  if (loadingCompanies) {
    return (
      <div className={styles.SelectCategorySpinnerContainer}>
        <FaSpinner className="icon-spin" />
      </div>
    )
  }

  return (
    <div className={styles.SelectCompanyContainer}>
      <FormSelect
        name="companyIds"
        placeholder={'Select a Company'}
        valueholder="Company"
        noOptionsMessage={() => 'No item found.'}
        defaultValue={selected}
        options={lists || []}
        onChange={onChange}
        onClear={onClear}
        isMulti={true}
      />
    </div>
  )
}

SelectCategoryComponent.propTypes = {
  type: PropTypes.string,
  userType: PropTypes.string,
  selected: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
}

export default SelectCategoryComponent
