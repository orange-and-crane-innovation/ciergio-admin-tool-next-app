import P from 'prop-types'
import Modal from '@app/components/modal'

function RemoveStaffModal({ user, open, onCancel, onOk, loading }) {
  const { firstName, lastName, jobTitle, companyName } = user
  return (
    <Modal
      title="Remove Staff"
      okText="Remove Staff"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
      onOk={onOk}
      width={550}
    >
      <div className="w-full">
        <div className="mb-4 px-4 pt-4">
          <p className="text-lg">
            {`Warning: You're about to remove `}
            <span className="font-bold">{`${firstName} ${lastName}`}</span>
            {` as ${jobTitle || 'admin'} of ${companyName}.`}
          </p>
        </div>
        <div className="mb-4 p-4 bg-blue-100">
          <ul className="list-disc p-4 text-lg">
            <li className="mb-2">{`${firstName}'s Profile will be removed from the unit.`}</li>
            <li className="mb-2">{`${firstName} won't be able to access this unit from their app.`}</li>
            <li className="mb-2">
              Messages, tickets, comments, and notes created by this user will
              still be viewable.
            </li>
          </ul>
        </div>
        <p className="px-4 pt-2 pb-8 text-lg">
          {`Are you sure you want to remove `}
          <span className="font-bold text-lg">{`${firstName} ${lastName}`}</span>{' '}
          {` from this unit?`}
        </p>
      </div>
    </Modal>
  )
}

RemoveStaffModal.propTypes = {
  user: P.object,
  loading: P.bool,
  onOk: P.func,
  onCancel: P.func,
  open: P.bool
}

export default RemoveStaffModal
