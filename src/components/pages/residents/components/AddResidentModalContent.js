import P from 'prop-types'
import { Controller } from 'react-hook-form'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'

const accountTypes = [
  {
    label: 'Unit Owner',
    value: 'unit-owner'
  },
  {
    label: 'Relative',
    value: 'relative'
  },
  {
    label: 'Other (Unregistered)',
    value: 'other'
  }
]

function AddResidentModalContent({ form }) {
  const { control } = form

  return (
    <div className="w-full">
      <form>
        <h3 className="font-bold text-sm mb-4">Unit #</h3>
        <Controller
          name="unit_number"
          control={control}
          render={({ name, onChange, value }) => (
            <FormSelect
              name={name}
              onChange={onChange}
              value={value}
              options={[
                {
                  label: 'Unit 1',
                  value: 'unit-1'
                }
              ]}
            />
          )}
        />
        <div className="w-full flex flex-col">
          <h3 className="text-sm font-bold mb-4">About the Resident</h3>
          <div className="w-full flex justify-between align-center">
            <Controller
              name="first_name"
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
              name="last_name"
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
            <h3 className="text-sm font-bold mb-4">Resident Type</h3>
            <Controller
              name="resident_type"
              control={control}
              render={({ name, value, onChange }) => (
                <FormSelect
                  name={name}
                  onChange={onChange}
                  value={value}
                  options={accountTypes}
                />
              )}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold ">Resident Email (optional)</h3>
            <p className="text-xs mb-4">
              An invite will be sent if an email is provided.
            </p>
            <Controller
              name="resident_email"
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
  form: P.object
}

export default AddResidentModalContent
