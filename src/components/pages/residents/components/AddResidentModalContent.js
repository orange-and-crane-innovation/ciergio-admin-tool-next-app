import { useMemo } from 'react'
import P from 'prop-types'
import { Controller } from 'react-hook-form'
import { useQuery } from '@apollo/client'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import { GET_UNITS } from '../queries'

import { sortBy } from 'lodash'

const relationshipOptions = [
  {
    label: 'Immediate Family',
    value: 'family'
  },
  {
    label: 'Housemate',
    value: 'housemate'
  },
  {
    label: 'Other Relatives',
    value: 'other-relatives'
  },
  {
    label: 'Tenant',
    value: 'tenant'
  },
  {
    label: 'Staff',
    value: 'staff'
  },
  {
    label: 'Other',
    value: 'other'
  }
]

function AddResidentModalContent({ form, buildingId }) {
  const { control, errors } = form

  const { data: units } = useQuery(GET_UNITS, {
    variables: {
      where: {
        occupied: true,
        buildingId
      }
    }
  })

  const unitOptions = useMemo(() => {
    if (units?.getUnits?.count > 0) {
      const unitsTemp = units.getUnits.data.map(unit => ({
        label: unit.name,
        value: unit._id
      }))

      return sortBy(unitsTemp, function (val) {
        return val.label
      })
    }
    return []
  }, [units?.getUnits])

  return (
    <div className="w-full">
      <form>
        <h3 className="mb-2 font-semibold text-base">Unit #</h3>
        <Controller
          name="unitId"
          control={control}
          render={({ name, value, onChange }) => (
            <FormSelect
              placeholder="Choose Unit"
              name={name}
              value={
                unitOptions
                  ? unitOptions.filter(item => item.value === value)
                  : null
              }
              onChange={e => {
                onChange(e.value)
              }}
              options={unitOptions}
              error={errors?.unitId?.message || null}
            />
          )}
        />
        <div className="mt-8 w-full flex flex-col">
          <h3 className="text-base font-bold mb-4">About the Resident</h3>
          <div className="w-full flex justify-between align-center">
            <span className="mr-1 w-full md:w-1/2">
              <div className="mb-2 font-semibold">First Name</div>
              <Controller
                name="firstName"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormInput
                    label=""
                    placeholder="Enter first name"
                    onChange={onChange}
                    name={name}
                    value={value}
                    error={errors?.firstName?.message || null}
                  />
                )}
              />
            </span>

            <span className="ml-1 w-full md:w-1/2">
              <div className="mb-2 font-semibold">Last Name</div>
              <Controller
                name="lastName"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormInput
                    placeholder="Enter last name"
                    onChange={onChange}
                    name={name}
                    value={value}
                    error={errors?.lastName?.message || null}
                  />
                )}
              />
            </span>
          </div>
          <div>
            <h3 className="mt-4 mb-2 text-base font-semibold">Relationship</h3>
            <Controller
              name="relationship"
              control={control}
              render={({ name, value, onChange }) => (
                <FormSelect
                  placeholder="Select relationship"
                  name={name}
                  value={
                    relationshipOptions
                      ? relationshipOptions.filter(item => item.label === value)
                      : null
                  }
                  onChange={e => {
                    onChange(e.label)
                  }}
                  options={relationshipOptions}
                  error={errors?.relationship?.message || null}
                />
              )}
            />
          </div>
          <div>
            <h3 className="mt-4 text-base leading-7 font-semibold">
              Resident Email
            </h3>
            <p className="text-md mb-4">
              An invite will be sent if an email is provided.
            </p>
            <Controller
              name="email"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  placeholder="Enter email address"
                  type="email"
                  onChange={onChange}
                  name={name}
                  value={value}
                  inputClassName="w-full rounded border-gray-300"
                  error={errors?.email?.message || null}
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

AddResidentModalContent.propTypes = {
  form: P.object,
  buildingId: P.string
}

export default AddResidentModalContent
