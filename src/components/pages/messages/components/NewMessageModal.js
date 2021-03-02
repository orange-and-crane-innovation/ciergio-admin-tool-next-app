import { useState } from 'react'
import P from 'prop-types'
import Modal from '@app/components/globals/Modal'
import FormInput from '@app/components/forms/form-input'
import Spinner from '@app/components/spinner'
import { FiSearch } from 'react-icons/fi'
import styles from '../messages.module.css'

export default function NewMessageModal({
  visible,
  onCancel,
  onSelectUser,
  users,
  loadingUsers
}) {
  const [searchText, setSearchText] = useState('')
  const units = users?.map((user, index) => user?.unit?.name || `Unit-${index}`)
  return (
    <Modal
      title="New Message"
      open={visible}
      onShowModal={onCancel}
      footer={null}
      width={454}
    >
      <div className={styles.newMessageInput}>
        <FormInput
          name="search"
          placeholder="Search"
          inputClassName="pr-8"
          onChange={e => {
            if (e.target.value !== '') {
              setSearchText(e.target.value)
            } else {
              setSearchText(null)
            }
          }}
          value={searchText}
        />
        <span className="absolute top-11 right-8">
          {searchText ? (
            <span
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              className="ciergio-close cursor-pointer"
              onClick={() => {}}
            />
          ) : (
            <FiSearch />
          )}
        </span>
      </div>
      <div className={styles.newMessageAccountsList}>
        {loadingUsers ? <Spinner /> : null}
        {!loadingUsers &&
          units.map(unit => {
            return (
              <div key={unit._id}>
                <p>{unit.name}</p>
                {users?.length > 0 && !loadingUsers
                  ? users.map(user => {
                      if (user?.unit?._id !== unit._id) return null

                      return (
                        <User
                          key={user._id}
                          data={user}
                          handleClick={onSelectUser}
                        />
                      )
                    })
                  : null}
              </div>
            )
          })}
      </div>
    </Modal>
  )
}

const User = ({ data, handleClick }) => {
  const user = data?.user
  const firstName = user?.firstName
  const lastName = user?.lastName
  const avatar = user?.avatar

  return (
    <div
      className={styles.newMessageUserItem}
      onClick={() => handleClick(user?._id)}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <div className="mr-4">
        <img
          src={
            avatar ||
            `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
          }
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
      </div>
      <div className="mr-4">
        <p>{`${lastName} ${firstName} `}</p>
      </div>
      <div>
        <p className="text-neutral-600 capitalize">
          {data?.accountType?.replace('_', ' ')}
        </p>
      </div>
    </div>
  )
}

User.propTypes = {
  data: P.object,
  handleClick: P.func
}

NewMessageModal.propTypes = {
  visible: P.bool,
  onCancel: P.func,
  onSelectUser: P.func,
  users: P.array,
  loadingUsers: P.bool
}
