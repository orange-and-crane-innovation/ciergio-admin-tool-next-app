import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import RadioBox from '@app/components/forms/form-radio'
import Modal from '@app/components/modal'

import SelectCompany from '@app/components/globals/SelectCompany'

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
  onCancel
}) => {
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState()
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState()

  useEffect(() => {
    setSelectedAudience('all')
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(null)
  }, [])

  const onSelectAudience = e => {
    setSelectedAudience(e.target.value)
    onSelectAudienceType(e.target.value)
  }

  const handleSelectCompanyExcept = data => {
    const selected = data.map(item => {
      return item.value
    })
    setSelectedCompanySpecific(null)
    setSelectedCompanyExcept(data)
    onSelectCompanyExcept(selected)
    onSelectCompanySpecific(null)
  }

  const handleClearCompanyExcept = () => {
    setSelectedCompanyExcept(null)
  }

  const handleSelectCompanySpecific = data => {
    const selected = data.map(item => {
      return item.value
    })
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(data)
    onSelectCompanySpecific(selected)
    onSelectCompanyExcept(null)
  }

  const handleClearCompanySpecific = () => {
    setSelectedCompanySpecific(null)
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
                All those registered under your complex
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
              />
              <div className="ml-7 text-neutral-500 text-md leading-relaxed">
                All those registered under your complex except
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
                    recieve/view the post
                  </p>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-neutral-500 mb-2">Companies</p>
                  <SelectCompany
                    type="active"
                    userType="administrator"
                    onChange={handleSelectCompanyExcept}
                    onClear={handleClearCompanyExcept}
                    selected={selectedCompanyExcept}
                  />
                </div>
              </>
            )}
            {selectedAudience === 'specific' && (
              <>
                <div className="mb-4">
                  <p className="font-bold">{`Don't share with`}</p>
                  <p>
                    Anyone tagged to the list of Audience will be restricted to
                    recieve/view the post
                  </p>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-neutral-500 mb-2">Companies</p>
                  <SelectCompany
                    type="active"
                    userType="administrator"
                    onChange={handleSelectCompanySpecific}
                    onClear={handleClearCompanySpecific}
                    selected={selectedCompanySpecific}
                  />
                </div>
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
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
