import { useMemo } from 'react'
import P from 'prop-types'
import { Controller } from 'react-hook-form'
import { useQuery } from '@apollo/client'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import { GET_UNITS } from '../queries'

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
  const { control } = form

  const { data: units } = useQuery(GET_UNITS, {
    where: {
      occupied: true,
      buildingId
    }
  })

  const unitOptions = useMemo(() => {
    if (units?.getUnits?.count > 0) {
      return units.getUnits.data.map(unit => ({
        label: unit.name,
        value: unit._id
      }))
    }
    return []
  }, [units?.getUnits])

  return (
    <div className="w-full">
      <form>
        <h3 className="font-bold text-sm mb-4">Unit #</h3>
        <Controller
          name="unit"
          control={control}
          render={({ name, onChange }) => (
            <FormSelect name={name} onChange={onChange} options={unitOptions} />
          )}
          defaultValue=""
        />
        <div className="w-full flex flex-col">
          <h3 className="text-sm font-bold mb-4">About the Resident</h3>
          <div className="w-full flex justify-between align-center">
            <Controller
              name="firstName"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="First Name"
                  placeholder="Enter first name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  inputClassName="w-full rounded border-gray-300"
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Last Name"
                  placeholder="Enter last name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  inputClassName="w-full rounded border-gray-300"
                />
              )}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4">Relationship</h3>
            <Controller
              name="relationship"
              control={control}
              render={({ name, onChange }) => (
                <FormSelect
                  name={name}
                  onChange={onChange}
                  options={relationshipOptions}
                />
              )}
              defaultValue=""
            />
          </div>
          <div>
            <h3 className="text-sm font-bold ">Resident Email (optional)</h3>
            <p className="text-xs mb-4">
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
