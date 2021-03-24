/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import P from 'prop-types'
import { FaPlusCircle, FaUserAlt, FaArrowRight } from 'react-icons/fa'

import Card from '@app/components/card'
import SimpleCard from '@app/components/card/simple'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import PageLoader from '@app/components/page-loader'

import { DATE } from '@app/utils'

import styles from './index.module.css'

const OverviewComponent = ({
  type,
  title,
  companyProfile,
  propertyHeader,
  propertyData,
  propertyLoading,
  historyHeader,
  historyData,
  historyLoading,
  units,
  unitsLoading,
  residents,
  residentsLoading,
  vacants,
  vacantsLoading,
  activePage,
  onPageClick,
  onLimitChange,
  onCreateButtonClick,
  onHistoryButtonClick,
  onUnitButtonClick,
  onSubscriptionButtonClick
}) => {
  const router = useRouter()
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  let buttonCreateLabel

  useEffect(() => {
    router.replace(`/properties/${type}/${router.query.id}/overview`)
  }, [])

  switch (type) {
    case 'company':
      buttonCreateLabel = 'Add Complex'
      break
    case 'complex':
      buttonCreateLabel = 'Add Building'
      break
    case 'unit':
      buttonCreateLabel = 'Create Extension Account'
      break
  }

  const getOrdinalSuffix = data => {
    const dataNum = parseInt(data)
    const ordinalNum =
      ['st', 'nd', 'rd'][
        (((((dataNum < 0 ? -dataNum : dataNum) + 90) % 100) - 10) % 10) - 1
      ] || 'th'
    return dataNum + ordinalNum + ' Floor'
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
                {unitsLoading ? (
                  <PageLoader />
                ) : (
                  <div className="text-5xl">{units?.count}</div>
                )}
              </>
            }
          />
          <SimpleCard
            info
            icon={<FaUserAlt />}
            content={
              <>
                <div className="text-base">Registered Residents</div>
                {residentsLoading ? (
                  <PageLoader />
                ) : (
                  <div className="text-5xl">{residents?.count}</div>
                )}
              </>
            }
          />
          <SimpleCard
            success
            icon={<i className="ciergio-glanceUnits" />}
            content={
              <>
                <div className="text-base">Vacant Units</div>
                {vacantsLoading ? (
                  <PageLoader />
                ) : (
                  <div className="text-5xl">{vacants?.count}</div>
                )}
              </>
            }
          />
        </div>
      )}

      <div className={styles.PageSubContainer}>
        <div className={styles.PageSubContainer2}>
          {((systemType === 'home' && type === 'complex') ||
            type === 'company' ||
            type === 'building' ||
            type === 'unit') && (
            <>
              <Card
                noPadding
                header={
                  <div className={styles.FlexCenterBetween}>
                    <span className={styles.CardHeader}>{`${title} (${
                      propertyData ? propertyData.count : 0
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
                content={
                  propertyLoading ? (
                    <PageLoader />
                  ) : (
                    propertyData && (
                      <Table rowNames={propertyHeader} items={propertyData} />
                    )
                  )
                }
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
              {propertyData && propertyData?.length > 10 && (
                <Pagination
                  items={propertyData}
                  activePage={activePage}
                  onPageClick={onPageClick}
                  onLimitChange={onLimitChange}
                />
              )}
            </>
          )}

          {type !== 'building' && type !== 'unit' && (
            <Card
              noPadding
              header={
                <div className={styles.FlexCenterBetween}>
                  <span className={styles.CardHeader}>Recent Activity</span>
                </div>
              }
              content={
                historyLoading ? (
                  <PageLoader />
                ) : (
                  historyData && (
                    <Table rowNames={historyHeader} items={historyData} />
                  )
                )
              }
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
          )}
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
                    <span className={styles.ContentSubText}>{`${
                      companyProfile?.complexes?.count ?? 0
                    } / ${companyProfile?.complexLimit ?? 0}`}</span>
                  </div>
                  <div className={styles.FlexColPadding}>
                    <span className={styles.ContentText}>Buildings Made</span>
                    <span className={styles.ContentSubText}>{`${
                      companyProfile?.buildings?.count ?? 0
                    } / ${companyProfile?.buildingLimit ?? 0}`}</span>
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
                    onClick={onSubscriptionButtonClick}
                  >
                    Upgrade Plan
                  </button>
                </div>
              }
            />
          </div>
        )}

        {type === 'unit' && (
          <div className={styles.PageSubContainer3}>
            <Card
              noPadding
              header={
                <div className={styles.ContentFlex}>
                  <span className={styles.CardHeader}>Unit Details</span>
                </div>
              }
              content={
                unitsLoading ? (
                  <PageLoader />
                ) : (
                  <div className={styles.FlexCol}>
                    <div className={styles.FlexColPadding}>
                      <span className={styles.ContentTextNormal}>
                        Building Name
                      </span>
                      <span className={styles.ContentSubTextNormal}>
                        {units?.building?.name}
                      </span>
                    </div>
                    <div className={styles.FlexColPadding}>
                      <span className={styles.ContentTextNormal}>
                        Floor Number
                      </span>
                      <span className={styles.ContentSubTextNormal}>
                        {getOrdinalSuffix(units?.floorNumber)}
                      </span>
                    </div>
                    <div className={styles.FlexColPadding}>
                      <span className={styles.ContentTextNormal}>
                        Unit Type
                      </span>
                      <span className={styles.ContentSubTextNormal}>
                        {units?.unitType?.name}
                      </span>
                    </div>
                    <div className={styles.FlexColPadding}>
                      <span className={styles.ContentTextNormal}>
                        Unit Size (sqm)
                      </span>
                      <span className={styles.ContentSubTextNormal}>
                        {units?.unitSize}
                      </span>
                    </div>
                    <div className={styles.FlexColPadding}>
                      <span className={styles.ContentTextNormal}>
                        Date Created
                      </span>
                      <span className={styles.ContentSubTextNormal}>
                        {DATE.toFriendlyDate(units?.createdAt)}
                      </span>
                    </div>
                  </div>
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

OverviewComponent.propTypes = {
  type: P.string.isRequired,
  title: P.string.isRequired,
  companyProfile: P.object,
  propertyHeader: P.array,
  propertyData: P.object,
  propertyLoading: P.bool,
  historyHeader: P.array,
  historyData: P.object,
  historyLoading: P.bool,
  units: P.object,
  unitsLoading: P.bool,
  residents: P.object,
  residentsLoading: P.bool,
  vacants: P.object,
  vacantsLoading: P.bool,
  activePage: P.number.isRequired,
  onPageClick: P.func.isRequired,
  onLimitChange: P.func.isRequired,
  onCreateButtonClick: P.func,
  onHistoryButtonClick: P.func,
  onUnitButtonClick: P.func,
  onSubscriptionButtonClick: P.func
}

export default OverviewComponent
