import FormTextArea from '@app/components/forms/form-textarea'
import { Controller } from 'react-hook-form'
import P from 'prop-types'

function AddNote({ forms }) {
  const { control, errors } = forms

  return (
    <div className="w-full h-1/4 text-base">
      <p className="font-bold">Note</p>
      <form>
        <Controller
          name="note"
          control={control}
          render={({ name, onChange, value }) => (
            <FormTextArea
              wrapperClassName="h-32"
              name={name}
              value={value}
              error={errors?.note?.message}
              maxLength={120}
              placeholder="Enter additional notes here"
              onChange={onChange}
              toolbarHidden
              withCounter
              stripHtmls
            />
          )}
        />
      </form>
    </div>
  )
}

AddNote.propTypes = {
  forms: P.object.isRequired
}

export default AddNote
