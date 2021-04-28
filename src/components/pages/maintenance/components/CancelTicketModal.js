import P from 'prop-types'
import Modal from '@app/components/modal'
import FormTextArea from '@app/components/forms/form-textarea'
import { Controller } from 'react-hook-form'

function CancelTicketModal({ open, onOk, onCancel, loading, form }) {
  const { errors, control } = form

  return (
    <Modal
      title="Cancel Ticket"
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
      onClose={onCancel}
      okText="Cancel Ticket"
      okButtonProps={{
        loading
      }}
    >
      <div>
        <h3 className="text-sm text-neutral-dark">State Reason</h3>
        <p className="text-sm text-neutral-500">
          For records purposes, state why the ticket is cancelled. This message
          will be posted as a comment on this ticket.
        </p>
        <Controller
          control={control}
          name="reason"
          render={({ name, value, onChange }) => (
            <FormTextArea
              maxLength={500}
              placeholder="Enter reason here"
              options={[]}
              toolbarHidden
              value={value}
              onChange={onChange}
              error={errors?.reason?.message}
            />
          )}
        />
      </div>
    </Modal>
  )
}

CancelTicketModal.propTypes = {
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  loading: P.bool,
  form: P.object.isRequired
}

export default CancelTicketModal
