import P from 'prop-types'
import { Controller } from 'react-hook-form'

import SelectDropdown from '@app/components/select'
import FormInput from '@app/components/forms/form-input'

function InviteStaffContent({
  form,
  buildingOptions,
  isBuilding,
  complexOptions,
  isComplex,
  staffRoles,
  staffType,
  companyOptions
}) {
  const { control, errors } = form

  return (
    <div className="w-full p-4">
      <form>
        <div className="mb-4">
          <p className="font-bold text-base text-gray-500 mb-2">Staff Type</p>
          <Controller
            name="staffType"
            control={control}
            render={({ name, value, onChange }) => (
              <SelectDropdown
                name={name}
                value={value}
                onChange={onChange}
                options={staffRoles}
                placeholder="Enter staff type"
                error={errors?.staffType?.message}
                isClearable
                isSearchable
              />
            )}
          />
        </div>
        <div className="mb-4">
          <p className="font-bold text-base text-gray-500 mb-2">Email</p>
          <Controller
            name="email"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                placeholder="Enter email of contact"
                type="email"
                name={name}
                onChange={onChange}
                value={value}
                error={errors?.email?.message}
                inputClassName="w-full rounded border-gray-300"
                description={
                  <p className="mb-2">An invite will be sent to this email.</p>
                }
              />
            )}
          />
        </div>
        {staffType !== undefined ? (
          <>
            <div>
              <p className="font-bold text-base text-gray-500 mb-2">
                Job Title of Point of Contact
              </p>
              <Controller
                name="jobTitle"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormInput
                    placeholder="Enter Job Title"
                    name={name}
                    onChange={onChange}
                    value={value}
                    error={errors?.jobTitle?.message}
                    inputClassName="w-full rounded border-gray-300"
                  />
                )}
              />
              <div>
                <p className="font-bold text-base text-gray-500 mb-2">
                  Assign To
                </p>
                <Controller
                  name="company"
                  control={control}
                  render={({ value, onChange, name }) => (
                    <SelectDropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={companyOptions}
                      placeholder="Select a company"
                      error={errors?.company?.message}
                      description={<p className="mb-2">Company</p>}
                      containerClasses="mb-4"
                    />
                  )}
                />
              </div>
              {(isComplex || isBuilding) && complexOptions?.length > 0 ? (
                <div>
                  <Controller
                    name="complex"
                    control={control}
                    render={({ value, onChange, name }) => (
                      <SelectDropdown
                        name={name}
                        value={value}
                        onChange={onChange}
                        options={complexOptions}
                        error={errors?.complex?.message}
                        description={<p className="mb-2">Complex</p>}
                        placeholder="Select a complex"
                        containerClasses="mb-4"
                      />
                    )}
                  />
                </div>
              ) : null}
              {isBuilding && buildingOptions?.length > 0 ? (
                <Controller
                  name="building"
                  control={control}
                  render={({ value, onChange, name }) => (
                    <SelectDropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      options={buildingOptions}
                      error={errors?.building?.message || undefined}
                      description={<p className="mb-2">Building</p>}
                      placeholder="Select a building"
                    />
                  )}
                />
              ) : null}
            </div>
          </>
        ) : null}
      </form>
    </div>
  )
}

InviteStaffContent.propTypes = {
  form: P.object,
  isComplex: P.bool,
  complexOptions: P.array,
  isBuilding: P.bool,
  buildingOptions: P.array,
  companyOptions: P.array,
  staffRoles: P.array,
  staffType: P.string
}

export default InviteStaffContent
