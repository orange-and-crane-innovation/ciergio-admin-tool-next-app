import FormTextArea from '@app/components/forms/form-textarea'
import { Controller } from 'react-hook-form'
import P from 'prop-types'

function AddNote({ forms }) {
  const { control } = forms

  return (
    <>
      <div className="w-full h-1/4">
        <p className="text-neutral-dark font-body font-bold text-sm">Note</p>
        <form>
          <Controller
            name="note"
            control={control}
            render={({ name, onChange, value }) => (
              <FormTextArea
                name={name}
                maxLength={120}
                placeholder="Enter additional notes here"
                toolbarHidden={true}
                onChange={onChange}
                value={value}
                withCounter={true}
              />
            )}
          />
        </form>
      </div>
    </>
  )
}

AddNote.propTypes = {
  forms: P.object.isRequired
}

export default AddNote
