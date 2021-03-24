import P from 'prop-types'
import { Controller } from 'react-hook-form'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'

function AddVisitorModalContent({ form }) {
  const { control } = form
  return (
    <>
      {' '}
      <div className="w-full">
        <form>
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between align-center">
              <Controller
                name="unit_number"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormSelect
                    label="Unit"
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
              <Controller
                name="unit_owner_name"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormSelect
                    label="Host"
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
                    options={{
                      label: 'Unit 1',
                      value: 'unit-1'
                    }}
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
    </>
  )
}

AddVisitorModalContent.propTypes = {
  form: P.object
}
export default AddVisitorModalContent
