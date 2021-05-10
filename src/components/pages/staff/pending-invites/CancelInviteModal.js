import P from 'prop-types'
import Modal from '@app/components/modal'

import getAccountTypeName from '@app/utils/getAccountTypeName'

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
        <p className="text-base leading-7">
          Are you sure you want to cancel invite for{' '}
          <span className="font-bold">{data?.email}</span> as
          <span className="capitalize">
            {' '}
            {getAccountTypeName(data?.accountType)}
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
