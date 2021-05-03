import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'

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

const SelectCompanyComponent = ({
  name,
  type,
  userType,
  placeholder,
  selected,
  error,
  onChange,
  onClear,
  isMulti
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

  return (
    <div className={styles.SelectCompanyContainer}>
      <FormSelect
        name={name}
        placeholder={placeholder}
        valueholder="Company"
        noOptionsMessage={() => 'No item found.'}
        defaultValue={selected}
        options={lists || []}
        error={error}
        loading={loadingCompanies}
        onChange={onChange}
        onClear={onClear}
        isMulti={isMulti}
        isClearable
      />
    </div>
  )
}

SelectCompanyComponent.defaultProps = {
  name: 'companyIds'
}

SelectCompanyComponent.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  userType: PropTypes.string,
  placeholder: PropTypes.string,
  selected: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  isMulti: PropTypes.bool
}

export default SelectCompanyComponent
