import Modal from '@app/components/modal'
import P from 'prop-types'
import Button from '@app/components/button'

function CancelInviteModal({ open, onCancel, onOk, loading }) {
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
        <div className="w-full text-center">
          <span className="ciergio-info text-8xl text-info-500" />
        </div>
        <h1 className="text-5xl text-neutral-dark text-center">
          Cancel Invite?
        </h1>
        <p className="text-center text-neutral-500 text-lg">
          Are you sure you want to cancel the invite?
        </p>
        <div className="flex items-center justify-center w-full pt-2">
          <Button label="No" className="mr-2 w-36 py-2" onClick={onCancel} />
          <Button
            primary
            label="Confirm"
            className="w-36 py-2"
            onClick={onOk}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  )
}

CancelInviteModal.propTypes = {
  open: P.bool.isRequired,
  onCancel: P.func.isRequired,
  onOk: P.func.isRequired,
  loading: P.bool
}

export default CancelInviteModal
