import Modal from '@app/components/modal'
import P from 'prop-types'
import Button from '@app/components/button'

function ResendBulkInviteModal({
  open,
  onCancel,
  onOk,
  bulkInvitesLength,
  loading
}) {
  return (
    <Modal
      visible={open}
      footer={null}
      onClose={onCancel}
      modalProps={{
        showCloseButton: false
      }}
    >
      <div className="pt-4">
        <p className="text-xl text-neutral-500 text-center px-4">
          {`You are about to "Resend Invite (${bulkInvitesLength}) item" from the list, do you want
          to continue?`}
        </p>
        <div className="flex items-center justify-center w-full pt-2">
          <Button label="No" className="mr-2 w-36 py-2" onClick={onCancel} />
          <Button
            primary
            label="Yes"
            className="w-36 py-2"
            onClick={onOk}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  )
}

ResendBulkInviteModal.propTypes = {
  open: P.bool.isRequired,
  onCancel: P.func.isRequired,
  onOk: P.func.isRequired,
  bulkInvitesLength: P.number.isRequired,
  loading: P.bool
}

export default ResendBulkInviteModal
