import { useEffect, useState, useMemo } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'

import Modal from '@app/components/modal'
import RadioBox from '@app/components/forms/form-radio'
import SelectCompany from '@app/components/select'
import { GET_COMPANIES } from '../../staff/queries'

function AudienceModal({
  visible,
  onCancel,
  onSave,
  onSelectCompanySpecific,
  onSelectAudienceType,
  onSelectCompanyExcept
}) {
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState()
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState()

  const { data: companies } = useQuery(GET_COMPANIES)

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

  const handleSelectCompanySpecific = data => {
    const selected = data.map(item => {
      return item.value
    })
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(data)
    onSelectCompanySpecific(selected)
    onSelectCompanyExcept(null)
  }

  const companySelections = useMemo(() => {
    if (companies?.getCompanies?.data?.length > 0) {
      return companies.getCompanies.data.map(company => ({
        label: company.name,
        value: company._id
      }))
    }

    return []
  }, [companies?.getCompanies])

  return (
    <Modal
      title="When do you want this published?"
      visible={visible}
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
                isChecked={selectedAudience === 'allExcept'}
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
              isChecked={selectedAudience === 'specific'}
            />
            <div className="ml-7 text-neutral-500 text-md leading-relaxed">
              Only show to those selected
            </div>
          </div>
        </div>

        {selectedAudience && selectedAudience !== 'all' && (
          <div className="">
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
                    options={companySelections}
                    onChange={handleSelectCompanyExcept}
                    value={selectedCompanyExcept}
                    allowMultiple
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
                    onChange={handleSelectCompanySpecific}
                    options={companySelections}
                    value={selectedCompanySpecific}
                    allowMultiple
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

AudienceModal.propTypes = {
  visible: P.bool,
  onCancel: P.func,
  onSave: P.func,
  onSelectAudienceType: P.func,
  onSelectCompanyExcept: P.func,
  onSelectCompanySpecific: P.func,
  onSelectComplexExcept: P.func,
  onSelectComplexSpecific: P.func,
  onSelectBuildingExcept: P.func,
  onSelectBuildingSpecific: P.func
}

export default AudienceModal
