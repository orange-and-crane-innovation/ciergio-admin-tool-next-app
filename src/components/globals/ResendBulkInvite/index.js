import Modal from '@app/components/modal'
import P from 'prop-types'
import getAccountTypeName from '@app/utils/getAccountTypeName'

function ResendBulkInvite({
  open,
  onCancel,
  onOk,
  bulkInvitesLength,
  data,
  loading,
  module
}) {
  const description =
    module === 'staff' ? (
      <span>
        Are you sure you want to resend invite for{' '}
        {<strong>{data?.email}</strong>} as{' '}
        {getAccountTypeName(data?.accountType)}?
      </span>
    ) : (
      `You are about to "Resend Invite (${bulkInvitesLength}) item" from the list, do you want
  to continue?`
    )

  return (
    <Modal
      title="Resend Invite"
      okText="Yes"
      cancelText="No"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
      onOk={onOk}
    >
      <div className="p-4">
        <p className="text-base leading-7">{description}</p>
      </div>
    </Modal>
  )
}

ResendBulkInvite.defaultProps = {
  module: 'residents'
}

ResendBulkInvite.propTypes = {
  open: P.bool.isRequired,
  onCancel: P.func.isRequired,
  onOk: P.func.isRequired,
  bulkInvitesLength: P.number,
  data: P.object,
  loading: P.bool,
  module: P.string.isRequired
}

export default ResendBulkInvite
