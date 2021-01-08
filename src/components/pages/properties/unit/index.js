/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import P from 'prop-types'
import { FaPlusCircle, FaSearch, FaTimes } from 'react-icons/fa'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'

import styles from './index.module.css'

const _ = require('lodash')

const UnitDirectoryComponent = ({
  title,
  tableHeader,
  tableData,
  activePage,
  onPageClick,
  onLimitChange,
  onCreateButtonClick
}) => {
  const [searchText, setSearchText] = useState()

  const bulkOptions = [
    {
      label: 'Resend Invite',
      value: 'reinvite'
    }
  ]

  const floorOptions = [
    {
      label: '1',
      value: '1'
    },
    {
      label: '2',
      value: '2'
    }
  ]

  const unitOptions = [
    {
      label: '10 BR',
      value: '1'
    },
    {
      label: '2-Bedroom',
      value: '2'
    }
  ]

  const onSearch = e => {
    setSearchText(e.target.value)
  }

  const onClearSearch = () => {
    setSearchText(null)
  }

  const getOrdinalSuffix = data => {
    const dataNum = parseInt(data)
    const ordinalNum =
      ['st', 'nd', 'rd'][
        (((((dataNum < 0 ? -dataNum : dataNum) + 90) % 100) - 10) % 10) - 1
      ] || 'th'
    return dataNum + ordinalNum + ' Floor'
  }

  const groupedData = _.groupBy(tableData.data, item => item.floorNo || null)
  const unitList = Object.keys(groupedData).map(key => [
    <tr>
      <td colSpan={7}>
        <strong>{getOrdinalSuffix(key)}</strong>
      </td>
    </tr>,
    ...groupedData[key].map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.checkbox}</td>
          <td>{item.unit}</td>
          <td>{item.name}</td>
          <td>{item.date}</td>
          <td>{item.residents}</td>
          <td>{item.unitType}</td>
          <td>{item.button}</td>
        </tr>
      )
    })
  ])

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderSmall}>
        <p>
          <strong>Unit Details</strong>
        </p>
        <p>
          Here you can see all unit details. To manage unit types and sizes,
          visit{' '}
          <a
            className={styles.LinkText}
            href="/properties/buiilding/5d804d6543df5f4239e72911"
          >
            Building Profile
          </a>
          .
        </p>
      </div>

      <div className={styles.MainControl}>
        <div className={styles.BulkControl}>
          <FormSelect options={bulkOptions} />
          <Button primary type="button" label="Apply" className="ml-2" />
        </div>
        <div className={styles.CategoryControl}>
          <FormSelect options={floorOptions} />
          <FormSelect options={unitOptions} />
          <div className={styles.SearchControl}>
            <FormInput
              name="search"
              placeholder="Search by title"
              inputClassName="pr-8"
              onChange={onSearch}
              value={searchText || ''}
            />
            <span className={styles.SearchControlIcon}>
              {searchText ? (
                <FaTimes className="cursor-pointer" onClick={onClearSearch} />
              ) : (
                <FaSearch />
              )}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.PageSubContainer}>
        <Card
          noPadding
          header={
            <div className={styles.FlexCenterBetween}>
              <span className={styles.CardHeader}>{`${title} (${
                tableData ? tableData.length : 0
              })`}</span>
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Create Unit"
                onClick={onCreateButtonClick}
              />
            </div>
          }
          content={
            <Table
              custom
              customHeader={
                <tr>
                  {tableHeader &&
                    tableHeader.map((item, index) => {
                      return (
                        <th key={index} width={item.width}>
                          {item.name}
                        </th>
                      )
                    })}
                </tr>
              }
              customBody={unitList}
            />
          }
        />
        <Pagination
          items={tableData}
          activePage={activePage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  )
}

UnitDirectoryComponent.propTypes = {
  title: P.string.isRequired,
  tableHeader: P.array.isRequired,
  tableData: P.object.isRequired,
  activePage: P.number.isRequired,
  onPageClick: P.func.isRequired,
  onLimitChange: P.func.isRequired,
  onCreateButtonClick: P.func.isRequired
}

export default UnitDirectoryComponent
