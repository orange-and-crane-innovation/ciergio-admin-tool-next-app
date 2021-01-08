/* eslint-disable react/jsx-key */
import React from 'react'
import P from 'prop-types'
import { FaPlusCircle, FaUserAlt, FaArrowRight } from 'react-icons/fa'

import Card from '@app/components/card'
import SimpleCard from '@app/components/card/simple'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'

import styles from './index.module.css'

const CompanyOverviewComponent = ({
  type,
  title,
  propertyHeader,
  propertyData,
  historyHeader,
  historyData,
  activePage,
  onPageClick,
  onLimitChange,
  onCreateButtonClick,
  onHistoryButtonClick,
  onUnitButtonClick
}) => {
  let buttonCreateLabel

  switch (type) {
    case 'company':
      buttonCreateLabel = 'Add Complex'
      break
    case 'complex':
      buttonCreateLabel = 'Add Building'
      break
  }

  return (
    <div className={styles.PageContainer}>
      {type === 'building' && (
        <div className={styles.PageCardContainer}>
          <SimpleCard
            primary
            icon={<i className="ciergio-glanceUnits" />}
            content={
              <>
                <div className="text-base">Total Units</div>
                <div className="text-5xl">20</div>
              </>
            }
          />
          <SimpleCard
            info
            icon={<FaUserAlt />}
            content={
              <>
                <div className="text-base">Registered Residents</div>
                <div className="text-5xl">14</div>
              </>
            }
          />
          <SimpleCard
            success
            icon={<i className="ciergio-glanceUnits" />}
            content={
              <>
                <div className="text-base">Vacant Units</div>
                <div className="text-5xl">7</div>
              </>
            }
          />
        </div>
      )}

      <div className={styles.PageSubContainer}>
        <div className={styles.PageSubContainer2}>
          <Card
            noPadding
            header={
              <div className={styles.FlexCenterBetween}>
                <span className={styles.CardHeader}>{`${title} (${
                  propertyData ? propertyData.length : 0
                })`}</span>
                {type !== 'building' && (
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label={buttonCreateLabel}
                    onClick={onCreateButtonClick}
                  />
                )}
              </div>
            }
            content={<Table rowNames={propertyHeader} items={propertyData} />}
            footer={
              type === 'building' ? (
                <div className={styles.CardFooterContainer}>
                  <Button
                    noBorder
                    label="View All Units"
                    rightIcon={<FaArrowRight />}
                    onClick={onUnitButtonClick}
                  />
                </div>
              ) : null
            }
          />
          <Pagination
            items={propertyData}
            activePage={activePage}
            onPageClick={onPageClick}
            onLimitChange={onLimitChange}
          />
        </div>

        {type === 'company' && (
          <div className={styles.PageSubContainer3}>
            <Card
              noPadding
              containerClass={styles.CardContentContainer}
              header={
                <div className={styles.ContentFlex}>
                  <span className={styles.CardHeader}>Subscription</span>
                </div>
              }
              content={
                <div className={styles.FlexCol}>
                  <div className={styles.FlexColPadding}>
                    <span className={styles.ContentText}>Complex Made</span>
                    <span className={styles.ContentSubText}>4/20</span>
                  </div>
                  <div className={styles.FlexColPadding}>
                    <span className={styles.ContentText}>Buildings Made</span>
                    <span className={styles.ContentSubText}>8/21</span>
                  </div>
                  <div className={styles.FlexColPadding}>
                    <span className={styles.ContentText}>
                      Subscription Ends
                    </span>
                    <span className={styles.ContentSubText}>No data</span>
                  </div>
                </div>
              }
              footer={
                <div className="text-center">
                  <button
                    className="font-bold"
                    onClick={() => alert('Upgrade Plan button clicked!')}
                  >
                    Upgrade Plan
                  </button>
                </div>
              }
            />
          </div>
        )}
      </div>

      {type !== 'building' && (
        <div className={styles.PageSubContainer2}>
          <Card
            noPadding
            header={
              <div className={styles.FlexCenterBetween}>
                <span className={styles.CardHeader}>Recent Activity</span>
              </div>
            }
            content={<Table rowNames={historyHeader} items={historyData} />}
            footer={
              <div className={styles.CardFooterContainer}>
                <Button
                  noBorder
                  label="View History"
                  rightIcon={<FaArrowRight />}
                  onClick={onHistoryButtonClick}
                />
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}

CompanyOverviewComponent.propTypes = {
  type: P.string.isRequired,
  title: P.string.isRequired,
  propertyHeader: P.array.isRequired,
  propertyData: P.object.isRequired,
  historyHeader: P.array.isRequired,
  historyData: P.object.isRequired,
  activePage: P.number.isRequired,
  onPageClick: P.func.isRequired,
  onLimitChange: P.func.isRequired,
  onCreateButtonClick: P.func.isRequired,
  onHistoryButtonClick: P.func.isRequired,
  onUnitButtonClick: P.func
}

export default CompanyOverviewComponent
