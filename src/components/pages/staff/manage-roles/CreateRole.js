import { useState, useEffect } from 'react'
import Button from '@app/components/button/Button'
import Modal from '@app/components/modal'
import Props from 'prop-types'
import InputText from '@app/components/forms/form-input'
import showToast from '@app/utils/toast'
import { useMutation } from '@apollo/client'
import { CREATE_COMPANY_ROLES } from './api/_query'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

const SCHEMA = yup.object().shape({
  name: yup.string().label('Role Name').required()
})

const ModalContent = ({ control, errors }) => {
  return (
    <Controller
      name="name"
      control={control}
      render={field => (
        <InputText
          error={errors?.name?.message ?? null}
          {...field}
          label="Role Name"
          placeholder="Enter Text"
        />
      )}
    />
  )
}

const CreateRole = ({ refetch, companyID }) => {
  const [visible, setVisible] = useState(false)

  const STATUS = 'active'
  //   this is only for repopulating permissions
  const PERMISSIONS = [
    {
      group: 'accounts',
      accessLevel: 'edit'
    }
  ]

  const [createCompanyRole, { loading, data, error }] = useMutation(
    CREATE_COMPANY_ROLES
  )

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(SCHEMA),
    defaultValues: {
      name: ''
    }
  })

  useEffect(() => {
    if (!loading && data && !error) {
      if (data) {
        refetch()
        showToast('success', 'Successfully updated a permission')
      }
    }

    if (!loading && !data && error) {
      showToast('danger', 'Create Role Failed')
    }
  }, [loading, data, error])

  const onSubmit = val => {
    createCompanyRole({
      variables: {
        data: {
          name: val?.name,
          status: STATUS,
          permissions: PERMISSIONS
        },
        companyId: companyID
      }
    })
  }

  return (
    <>
      <Button
        primary
        label="Create Role"
        onClick={() => setVisible(prev => !prev)}
      />
      <Modal
        title="Add New Role"
        visible={visible}
        onClose={() => setVisible(false)}
        okText="Create Role"
        onOk={handleSubmit(onSubmit)}
      >
        <ModalContent control={control} errors={errors} />
      </Modal>
    </>
  )
}

ModalContent.propTypes = {
  control: Props.any,
  errors: Props.object
}

CreateRole.propTypes = {
  companyID: Props.string.isRequired,
  refetch: Props.func.isRequired
}

export default CreateRole
