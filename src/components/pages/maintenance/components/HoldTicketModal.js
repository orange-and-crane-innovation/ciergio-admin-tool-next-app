import P from 'prop-types'
import Modal from '@app/components/modal'
import FormTextArea from '@app/components/forms/form-textarea'
import { Controller } from 'react-hook-form'

function HoldTicketModal({ open, onOk, onCancel, loading, form }) {
  const { errors, control } = form

  return (
    <Modal
      title="On Hold"
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
      onClose={onCancel}
      okText="Confirm"
      okButtonProps={{
        loading
      }}
    >
      <div>
        <h3 className="text-base leading-10 font-bold">State Reason</h3>
        <p className="text-md leading-5">
          Please let resident know why this ticket is put on hold. This message
          will be posted as a comment on this ticket.
        </p>
        <Controller
          control={control}
          name="reason"
          render={({ name, value, onChange }) => (
            <FormTextArea
              wrapperClassName="h-32"
              maxLength={500}
              placeholder="Enter reason here"
              value={value}
              onChange={onChange}
              error={errors?.reason?.message}
              toolbarHidden
              stripHtmls
            />
          )}
        />
      </div>
    </Modal>
  )
}

HoldTicketModal.propTypes = {
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  loading: P.bool,
  form: P.object.isRequired
}

export default HoldTicketModal
