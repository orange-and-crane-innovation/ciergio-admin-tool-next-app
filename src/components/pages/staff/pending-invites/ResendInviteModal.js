import P from 'prop-types'
import Modal from '@app/components/modal'

function ResendInviteModal({ open, onCancel, onOk, loading, data }) {
  return (
    <Modal
      title="Resend Invite"
      okText="Resend Invite"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
      onOk={onOk}
    >
      <div className="p-4">
        <p>
          Are you sure you want to resend invite for{' '}
          <span className="font-bold">{data?.email}</span> as
          <span className="capitalize">
            {data?.accountType?.replace('_', ' ')}
          </span>
          ?
        </p>
      </div>
    </Modal>
  )
}

ResendInviteModal.propTypes = {
  open: P.bool,
  onCancel: P.func,
  onOk: P.func,
  data: P.object,
  loading: P.bool
}

export default ResendInviteModal
