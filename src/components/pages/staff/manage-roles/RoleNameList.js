import Props from 'prop-types'
import { useEffect, useState } from 'react'
import Dropdown from '@app/components/dropdown'
import { FaEllipsisH } from 'react-icons/fa'
import { BsTrash, BsPencil } from 'react-icons/bs'
import Modal from '@app/components/modal'
import Input from '@app/components/forms/form-input'
import { UPDATE_COMPANY_ROLES } from './api/_query'

import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import isEmpty from 'lodash/isEmpty'
import showToast from '@app/utils/toast'

const EDIT_SCHEMA = yup.object().shape({
  name: yup.string().label('Role Name').required()
})

const RoleName = ({ role, key, handleModal }) => {
  const dropDown = [
    {
      label: 'Edit Role',
      icon: <BsPencil />,
      function: () => handleModal('edit', role)
    },
    {
      label: 'Delete Role',
      icon: <BsTrash />,
      function: () => handleModal('delete', role)
    }
  ]
  return (
    <div
      className="flex-1 shrink min-w-3xs basis-0 max-h-5xs min-h-5xs"
      key={key}
      style={{ minHeight: '20px' }}
    >
      <div className="flex flex-row justify-between items-center">
        <span className="font-bold mb-2">{role?.name}</span>
        <Dropdown label={<FaEllipsisH />} items={dropDown} />
      </div>
    </div>
  )
}

const EditModalContent = ({ control, errors }) => {
  return (
    <Controller
      control={control}
      name="name"
      render={field => (
        <Input
          {...field}
          label="Role Name"
          error={errors?.name?.message ?? null}
        />
      )}
    />
  )
}

const DeleteModalContent = () => {
  return (
    <p>
      Are you sure you want to delete the <b>Management</b> role? This action
      cannot be undone.
    </p>
  )
}

const RoleNames = ({ roleNames, refetch }) => {
  const [visible, setVisible] = useState(false)
  const [modalType, setModalType] = useState('edit')
  const [roleValue, setRoleValue] = useState({})
  const user = JSON.parse(localStorage.getItem('profile'))

  const isEditType = modalType === 'edit'

  const [
    updateCompanyRole,
    { loading: loadingUpdate, data: dataUpdate, error: errorUpdate }
  ] = useMutation(UPDATE_COMPANY_ROLES)

  const { handleSubmit, control, errors, setValue } = useForm({
    resolver: isEditType && yupResolver(EDIT_SCHEMA),
    defaultValues: isEditType && {
      name: ''
    }
  })

  useEffect(() => {
    if (!loadingUpdate && dataUpdate && !errorUpdate) {
      if (dataUpdate) {
        setRoleValue({})
        refetch()
        showToast('success', 'Role Name successfully updated')
      }
    }

    if (errorUpdate && !dataUpdate) {
      showToast('danger', 'Theres a problem updating a role')
    }
    setVisible(false)
  }, [loadingUpdate, dataUpdate, errorUpdate])

  const handleModal = (type, role) => {
    if (type && !isEmpty(role)) {
      switch (type) {
        case 'edit':
          setModalType('edit')
          setValue('name', role?.name)
          break
        case 'delete':
          setModalType('delete')
          break
        default:
          console.log('Not found')
      }
      setRoleValue(role)
      setVisible(prev => !prev)
    }
  }

  const onSubmit = val => {
    if (!isEmpty(val)) {
      const permissions = roleValue?.permissions.map(permission => ({
        group: permission.group,
        accessLevel: permission.accessLevel
      }))
      updateCompanyRole({
        variables: {
          companyRoleId: roleValue?._id,
          data: {
            name: val?.name,
            status: roleValue?.status,
            permissions: permissions,
            authorId: user?._id
          }
        }
      })
    } else {
      console.log('delete')
    }
  }

  return (
    <>
      <div className="mt-10 flex flex-col gap-7">
        {roleNames &&
          roleNames.map((role, idx) => (
            <RoleName handleModal={handleModal} key={role.id} role={role} />
          ))}
      </div>
      <Modal
        title={isEditType ? 'Edit Role' : 'Delete Role'}
        onClose={() => setVisible(false)}
        okText={isEditType ? 'Update' : 'Delete'}
        okButtonProps={{ danger: !isEditType }}
        visible={visible}
        onOk={handleSubmit(onSubmit)}
      >
        {isEditType ? (
          <EditModalContent control={control} errors={errors} />
        ) : (
          <DeleteModalContent />
        )}
      </Modal>
    </>
  )
}
const RoleNameList = ({ data, loading, refetch }) => {
  const [roleNames, setRoleNames] = useState([])

  useEffect(() => {
    if (!loading && data) {
      const names = data?.getCompanyRoles.filter(
        companyRole => companyRole.status
      )

      setRoleNames(names)
    }
  }, [loading, data])

  return (
    <div className="mt-10">
      <span className="font-bold text-neutral-500">Roles</span>
      {roleNames && <RoleNames refetch={refetch} roleNames={roleNames} />}
    </div>
  )
}

RoleNames.propTypes = {
  roleNames: Props.array,
  refetch: Props.func
}

RoleName.propTypes = {
  role: Props.object,
  key: Props.string,
  handleModal: Props.func
}

RoleNameList.propTypes = {
  data: Props.array,
  loading: Props.bool,
  refetch: Props.func
}

EditModalContent.propTypes = {
  control: Props.any,
  errors: Props.object
}

export default RoleNameList
