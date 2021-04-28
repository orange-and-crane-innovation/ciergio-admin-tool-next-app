import P from 'prop-types'
import Modal from '@app/components/modal'
import { parseAccountType } from '../constants'

function CancelInviteModal({ open, onCancel, data, loading, onOk }) {
  return (
    <Modal
      title="Cancel Invite"
      okText="Cancel Invite"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
      onOk={onOk}
    >
      <div className="p-4">
        <p className="text-lg">
          Are you sure you want to cancel invite for{' '}
          <span className="font-bold">{data?.email}</span> as
          <span className="capitalize">
            {' '}
            {parseAccountType(data?.accountType)}
          </span>
          ?
        </p>
      </div>
    </Modal>
  )
}

CancelInviteModal.propTypes = {
  open: P.bool,
  onCancel: P.func,
  onOk: P.func,
  data: P.object,
  loading: P.bool
}

export default CancelInviteModal
