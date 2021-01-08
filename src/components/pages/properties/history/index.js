/* eslint-disable react/jsx-key */
import React from 'react'
import P from 'prop-types'

import Card from '@app/components/card'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'

import styles from './index.module.css'

const CompanyHistoryComponent = ({
  header,
  data,
  activePage,
  onPageClick,
  onLimitChange
}) => {
  return (
    <div className={styles.PageContainer}>
      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span className={styles.CardHeader}>Recent Activity</span>
          </div>
        }
        content={<Table rowNames={header} items={data} />}
      />
      <Pagination
        items={data}
        activePage={activePage}
        onPageClick={onPageClick}
        onLimitChange={onLimitChange}
      />
    </div>
  )
}

CompanyHistoryComponent.propTypes = {
  header: P.array.isRequired,
  data: P.object.isRequired,
  activePage: P.number.isRequired,
  onPageClick: P.func.isRequired,
  onLimitChange: P.func.isRequired
}

export default CompanyHistoryComponent
