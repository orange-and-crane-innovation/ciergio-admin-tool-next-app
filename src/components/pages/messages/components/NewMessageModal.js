import { useState, useMemo, useEffect } from 'react'
import P from 'prop-types'
import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import Spinner from '@app/components/spinner'
import useDebounce from '@app/utils/useDebounce'
import { FiSearch } from 'react-icons/fi'
import styles from '../messages.module.css'

import { ACCOUNT_TYPES } from '@app/constants'

export default function NewMessageModal({
  visible,
  onCancel,
  onSelectUser,
  users,
  loadingUsers,
  onSearchChange
}) {
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 700)

  useEffect(() => {
    onSearchChange(debouncedSearchText)
  }, [debouncedSearchText])

  const mappedMembers = useMemo(() => {
    if (users?.length > 0) {
      return users.map(user => {
        if (
          user?.accountType === ACCOUNT_TYPES.MEM.value ||
          user?.accountType === ACCOUNT_TYPES.UNIT.value ||
          user?.accountType === ACCOUNT_TYPES.RES.value
        ) {
          return user
        }
        return undefined
      })
    }
  }, [users])

  const mappedAdmins = useMemo(() => {
    if (users?.length > 0) {
      return users.map(user => {
        if (
          user?.accountType === ACCOUNT_TYPES.SUP.value ||
          user?.accountType === ACCOUNT_TYPES.COMPYAD.value ||
          user?.accountType === ACCOUNT_TYPES.COMPXAD.value ||
          user?.accountType === ACCOUNT_TYPES.BUIGAD.value ||
          user?.accountType === ACCOUNT_TYPES.RECEP.value
        ) {
          return user
        }
        return undefined
      })
    }
  }, [users])

  return (
    <Modal
      title="New Message"
      visible={visible}
      onClose={() => {
        setSearchText('')
        onCancel()
      }}
      footer={null}
      width={454}
    >
      <div className={styles.newMessageInput}>
        <FormInput
          name="search"
          placeholder="Search"
          inputClassName="pr-8"
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
        />
        <span className="absolute top-11 right-8">
          {searchText ? (
            <span
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              className="ciergio-close cursor-pointer"
              onClick={() => setSearchText('')}
            />
          ) : (
            <FiSearch />
          )}
        </span>
      </div>
      <div className={styles.newMessageAccountsList}>
        {loadingUsers ? <Spinner /> : null}
        {mappedAdmins?.length > 0 ? (
          <h4 className="font-bold text-base px-4 py-2">Admins</h4>
        ) : null}
        {!loadingUsers &&
          mappedAdmins?.map(admin => {
            if (admin) {
              return (
                <User
                  key={admin?._id}
                  data={admin}
                  handleClick={onSelectUser}
                />
              )
            }
            return null
          })}
        {mappedMembers?.length > 0 ? (
          <h4 className="font-bold text-base p-4">Members</h4>
        ) : null}
        {!loadingUsers &&
          mappedMembers?.map(member => {
            if (member) {
              return (
                <User
                  key={member?._id}
                  data={member}
                  handleClick={onSelectUser}
                />
              )
            }
            return null
          })}
      </div>
    </Modal>
  )
}

const User = ({ data, handleClick }) => {
  const accountId = data?._id
  const user = data?.user
  const firstName = user?.firstName
  const lastName = user?.lastName
  const avatar = user?.avatar

  return (
    <div
      className={styles.newMessageUserItem}
      onClick={() => handleClick(accountId)}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <div className="mr-4">
        <img
          src={
            avatar ??
            `https://s3-ap-southeast-1.amazonaws.com/ciergio-online.assets/web-assets/ava-default.png`
          }
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
      </div>
      <div className="mr-4">
        <p>{`${firstName} ${lastName} `}</p>
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
  loadingUsers: P.bool,
  onSearchChange: P.func,
  searchText: P.string
}
