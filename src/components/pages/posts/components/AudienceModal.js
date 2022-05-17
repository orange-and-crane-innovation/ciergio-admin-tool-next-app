import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import RadioBox from '@app/components/forms/form-radio'
import Modal from '@app/components/modal'

import { ACCOUNT_TYPES } from '@app/constants'

import SelectCompany from '@app/components/globals/SelectCompany'
import SelectComplex from '@app/components/globals/SelectComplex'
import SelectBuilding from '@app/components/globals/SelectBuilding'
import SelectGroup from '@app/components/globals/SelectGroup'

const Component = ({
  isShown,
  onSelectAudienceType,
  onSelectCompanyExcept,
  onSelectCompanySpecific,
  onSelectComplexExcept,
  onSelectComplexSpecific,
  onSelectBuildingExcept,
  onSelectBuildingSpecific,
  onSave,
  onCancel,
  valueAudienceType,
  valueCompanyExcept,
  valueCompanySpecific,
  valueComplexExcept,
  valueComplexSpecific,
  valueBuildingExcept,
  valueBuildingSpecific,
  valueGroupExcept,
  valueGroupSpecific
}) => {
  const [selectedAudience, setSelectedAudience] = useState(valueAudienceType)
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState(
    valueCompanyExcept
  )
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState(
    valueCompanySpecific
  )
  const [selectedComplexExcept, setSelectedComplexExcept] = useState(
    valueComplexExcept
  )
  const [selectedComplexSpecific, setSelectedComplexSpecific] = useState(
    valueComplexSpecific
  )
  const [selectedBuildingExcept, setSelectedBuildingExcept] = useState(
    valueBuildingExcept
  )
  const [selectedBuildingSpecific, setSelectedBuildingSpecific] = useState(
    valueBuildingSpecific
  )
  const [selectedGroupExcept, setSelectedGroupExcept] = useState(
    valueGroupExcept
  )
  const [selectedGroupSpecific, setSelectedGroupSpecific] = useState(
    valueGroupSpecific
  )
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  let userType

  useEffect(() => {
    setSelectedAudience(valueAudienceType)
    setSelectedCompanyExcept(valueCompanyExcept)
    setSelectedCompanySpecific(valueCompanySpecific)

    setSelectedComplexExcept(valueComplexExcept)
    setSelectedComplexSpecific(valueComplexSpecific)

    setSelectedBuildingExcept(valueBuildingExcept)
    setSelectedBuildingSpecific(valueBuildingSpecific)

    setSelectedGroupExcept(valueGroupExcept)
    setSelectedGroupSpecific(valueGroupSpecific)
  }, [
    valueAudienceType,
    valueCompanyExcept,
    valueCompanySpecific,
    valueComplexExcept,
    valueComplexSpecific,
    valueBuildingExcept,
    valueBuildingSpecific,
    valueGroupExcept,
    valueGroupSpecific
  ])

  const onSelectAudience = e => {
    setSelectedAudience(e.target.value)
    onSelectAudienceType(e.target.value)
  }

  const handleSelectCompanyExcept = data => {
    setSelectedCompanySpecific(null)
    setSelectedCompanyExcept(data)
    onSelectCompanyExcept(data)
    onSelectCompanySpecific(null)
  }

  const handleClearCompanyExcept = () => {
    setSelectedCompanyExcept(null)
  }

  const handleSelectCompanySpecific = data => {
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(data)
    onSelectCompanySpecific(data)
    onSelectCompanyExcept(null)
  }

  const handleClearCompanySpecific = () => {
    setSelectedCompanySpecific(null)
  }

  const handleSelectComplexExcept = data => {
    setSelectedComplexSpecific(null)
    setSelectedComplexExcept(data)
    onSelectComplexExcept(data)
    onSelectComplexSpecific(null)
  }

  const handleClearComplexExcept = () => {
    setSelectedComplexExcept(null)
  }

  const handleSelectComplexSpecific = data => {
    setSelectedComplexExcept(null)
    setSelectedComplexSpecific(data)
    onSelectComplexSpecific(data)
    onSelectComplexExcept(null)
  }

  const handleClearComplexSpecific = () => {
    setSelectedComplexSpecific(null)
  }

  const handleSelectBuildingExcept = data => {
    setSelectedBuildingSpecific(null)
    setSelectedBuildingExcept(data)
    onSelectBuildingExcept(data)
    onSelectBuildingSpecific(null)
  }

  const handleClearBuildingExcept = () => {
    setSelectedBuildingExcept(null)
  }

  const handleSelectBuildingSpecific = data => {
    setSelectedBuildingExcept(null)
    setSelectedBuildingSpecific(data)
    onSelectBuildingSpecific(data)
    onSelectBuildingExcept(null)
  }

  const handleClearBuildingSpecific = () => {
    setSelectedBuildingSpecific(null)
  }

  const handleSelectGroupSpecific = data => {
    setSelectedGroupExcept(null)
    setSelectedGroupSpecific(data)
    setSelectedGroupSpecific(data)
    setSelectedGroupExcept(null)
  }

  const handleClearGroupSpecific = () => {
    setSelectedGroupExcept(null)
  }

  switch (accountType) {
    case ACCOUNT_TYPES.COMPYAD.value: {
      userType = 'company'
      break
    }
    case ACCOUNT_TYPES.COMPXAD.value: {
      userType = 'complex'
      break
    }
    case ACCOUNT_TYPES.BUIGAD.value: {
      userType = 'building'
      break
    }
    default: {
      userType = null
      break
    }
  }

  return (
    <Modal
      title="Who are the audience"
      visible={isShown}
      onClose={onCancel}
      onCancel={onCancel}
      onOk={onSave}
      okText="Save"
    >
      <div className="p-4 text-base leading-7">
        <div className="font-bold">Audience</div>
        <div>You may choose where to show this post.</div>
        <div className="mb-4">
          <div className="flex">
            <div className="p-4">
              <RadioBox
                primary
                id="all"
                name="audience"
                label="All"
                value="all"
                onChange={onSelectAudience}
                isChecked={selectedAudience === 'all'}
              />
              <div className="ml-7 text-neutral-500 text-md leading-relaxed">
                {userType
                  ? `All those registered under your ${userType}`
                  : `All those registered`}
              </div>
            </div>
            <div className="p-4">
              <RadioBox
                primary
                id="except"
                name="audience"
                label="All except"
                value="allExcept"
                onChange={onSelectAudience}
                isChecked={selectedAudience === 'allExcept'}
              />
              <div className="ml-7 text-neutral-500 text-md leading-relaxed">
                {userType
                  ? `All those registered under your ${userType} except`
                  : `All those registered except`}
              </div>
            </div>
          </div>
          <div className="p-4">
            <RadioBox
              primary
              id="specific"
              name="audience"
              label="Select specific audience"
              value="specific"
              onChange={onSelectAudience}
              isChecked={selectedAudience === 'specific'}
            />
            <div className="ml-7 text-neutral-500 text-md leading-relaxed">
              Only show to those selected
            </div>
          </div>
        </div>

        {selectedAudience && selectedAudience !== 'all' && (
          <div className="bg-neutral-200 -mx-8 p-6">
            {selectedAudience === 'allExcept' && (
              <>
                <div className="mb-4">
                  <p className="font-bold">{`Don't share with`}</p>
                  <p>
                    Anyone tagged to the list of Audience will be restricted to
                    receive/view the post
                  </p>
                </div>

                {accountType === ACCOUNT_TYPES.SUP.value && (
                  <div className="mb-4">
                    <p className="font-bold text-neutral-500 mb-2">Companies</p>
                    <SelectCompany
                      name="companyIds"
                      type="active"
                      userType={accountType}
                      placeholder="Select a Company"
                      onChange={handleSelectCompanyExcept}
                      onClear={handleClearCompanyExcept}
                      selected={selectedCompanyExcept}
                      isMulti
                    />
                  </div>
                )}

                {accountType === ACCOUNT_TYPES.COMPYAD.value && (
                  <div className="mb-4">
                    <p className="font-bold text-neutral-500 mb-2">Complexes</p>
                    <SelectComplex
                      type="active"
                      userType={accountType}
                      placeholder="Select a Complex"
                      companyId={user?.accounts?.data[0]?.company?._id}
                      onChange={handleSelectComplexExcept}
                      onClear={handleClearComplexExcept}
                      selected={selectedComplexExcept}
                    />
                  </div>
                )}

                {accountType === ACCOUNT_TYPES.COMPXAD.value && (
                  <div className="mb-4">
                    <p className="font-bold text-neutral-500 mb-2">Buildings</p>
                    <SelectBuilding
                      type="active"
                      userType={accountType}
                      placeholder="Select a Building"
                      onChange={handleSelectBuildingExcept}
                      onClear={handleClearBuildingExcept}
                      selected={selectedBuildingExcept}
                    />
                  </div>
                )}
              </>
            )}
            {selectedAudience === 'specific' && (
              <>
                <div className="mb-4">
                  <p className="font-bold">{`Share with`}</p>
                  <p>
                    Anyone tagged in this list will be able to see the post.
                  </p>
                </div>

                {accountType === ACCOUNT_TYPES.SUP.value && (
                  <div className="mb-4">
                    <p className="font-bold text-neutral-500 mb-2">Companies</p>
                    <SelectCompany
                      name="companyIds"
                      type="active"
                      userType={accountType}
                      placeholder="Select a Company"
                      onChange={handleSelectCompanySpecific}
                      onClear={handleClearCompanySpecific}
                      selected={selectedCompanySpecific}
                      isMulti
                    />
                  </div>
                )}

                {accountType === ACCOUNT_TYPES.COMPYAD.value && (
                  <div className="mb-4">
                    <p className="font-bold text-neutral-500 mb-2">Complexes</p>
                    <SelectComplex
                      type="active"
                      userType={accountType}
                      placeholder="Select a Complex"
                      companyId={user?.accounts?.data[0]?.company?._id}
                      onChange={handleSelectComplexSpecific}
                      onClear={handleClearComplexSpecific}
                      selected={selectedComplexSpecific}
                    />
                  </div>
                )}

                {accountType === ACCOUNT_TYPES.COMPXAD.value && (
                  <div className="mb-4">
                    <p className="font-bold text-neutral-500 mb-2">Buildings</p>
                    <SelectBuilding
                      type="active"
                      userType={accountType}
                      placeholder="Select a Building"
                      onChange={handleSelectBuildingSpecific}
                      onClear={handleClearBuildingSpecific}
                      selected={selectedBuildingSpecific}
                    />
                  </div>
                )}

                {/* {accountType === ACCOUNT_TYPES.COMPYAD.value && ( */}
                <div className="mb-4">
                  <p className="font-bold text-neutral-500 mb-2">Groups</p>
                  <SelectGroup
                    type="active"
                    placeholder="Select a Group"
                    companyId={user?.accounts?.data[0]?.company?._id}
                    onChange={handleSelectGroupSpecific}
                    onClear={handleClearGroupSpecific}
                    selected={selectedGroupSpecific}
                  />
                </div>
                {/* )} */}
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

Component.propTypes = {
  isShown: PropTypes.bool,
  onSelectAudienceType: PropTypes.func,
  onSelectCompanyExcept: PropTypes.func,
  onSelectCompanySpecific: PropTypes.func,
  onSelectComplexExcept: PropTypes.func,
  onSelectComplexSpecific: PropTypes.func,
  onSelectBuildingExcept: PropTypes.func,
  onSelectBuildingSpecific: PropTypes.func,
  onSelectGroupSpecific: PropTypes.func,
  onSelectGroupExcept: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  valueAudienceType: PropTypes.string,
  valueCompanyExcept: PropTypes.array,
  valueCompanySpecific: PropTypes.array,
  valueComplexExcept: PropTypes.array,
  valueComplexSpecific: PropTypes.array,
  valueBuildingExcept: PropTypes.array,
  valueBuildingSpecific: PropTypes.array,
  valueGroupExcept: PropTypes.array,
  valueGroupSpecific: PropTypes.array
}

export default Component
