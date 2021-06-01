import Modal from '@app/components/modal'
import P from 'prop-types'

function CancelInviteModal({ open, onCancel, onOk, data, loading }) {
  return (
    <Modal
      title="Cancel Invite"
      okText="Cancel Invite"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{
        loading
      }}
    >
      <div className="p-4">
        <p className="text-base leading-7">
          Are you sure you want to cancel invite for
          <span className="font-bold">{` ${data?.firstName} ${data?.lastName} (${data?.email})`}</span>
          ?
        </p>
      </div>
    </Modal>
  )
}

CancelInviteModal.propTypes = {
  open: P.bool.isRequired,
  onCancel: P.func.isRequired,
  onOk: P.func.isRequired,
  data: P.object,
  loading: P.bool
}

export default CancelInviteModal
