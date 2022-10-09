import * as yup from 'yup'

import { Controller, useForm } from 'react-hook-form'
import { FaEllipsisH, FaExclamationCircle, FaPlusCircle } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

import Button from '@app/components/button'
import { Card } from '@app/components/globals'
import Dropdown from '@app/components/dropdown'
import Input from '@app/components/forms/form-input'
import Modal from '@app/components/modal'
import Props from 'prop-types'
import SearchControl from '@app/components/globals/SearchControl'
import Table from '@app/components/table'
import Toggle from '@app/components/toggle'
import { debounce } from 'lodash'
import errorHandler from '@app/utils/errorHandler'
import isEmpty from 'lodash/isEmpty'
import showToast from '@app/utils/toast'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'

const SCHEMA = yup.object().shape({
  name: yup.string().label('Group name').required()
})

const tableRowNames = [
  {
    name: 'Group Name',
    width: '95%'
  },
  {
    name: 'Actions',
    width: ''
  }
]

const GET_COMPANY_GROUPS = gql`
  query($where: getCompanyGroupsParams) {
    getCompanyGroups(where: $where) {
      _id
      name
      status
      companyId
    }
  }
`

const CREATE_COMPANY_GROUP = gql`
  mutation createCompanyGroup(
    $data: InputCreateCompanyGroup
    $companyId: String
  ) {
    createCompanyGroup(data: $data, companyId: $companyId) {
      _id
      message
    }
  }
`

const UPDATE_COMPANY_GROUP = gql`
  mutation updateCompanyGroup(
    $data: InputUpdateCompanyGroup
    $companyGroupId: String
  ) {
    updateCompanyGroup(data: $data, companyGroupId: $companyGroupId) {
      _id
      message
    }
  }
`

const DELETE_COMPANY_GROUP = gql`
  mutation deleteCompanyGroup($companyGroupId: String) {
    deleteCompanyGroup(companyGroupId: $companyGroupId) {
      _id
      message
    }
  }
`

const defaultModalState = {
  type: 'add',
  visible: false,
  okText: 'Save',
  title: 'Create New Group'
}

const AddEditModalContent = ({
  control,
  errors,
  selected,
  isCreate,
  gc,
  toogle
}) => {
  return (
    <Controller
      control={control}
      defaultValue={selected?.name ? selected?.name : ''}
      name="name"
      render={field => {
        field.defaultValue = selected?.name ? selected?.name : ''
        return (
          <>
            <Input
              {...field}
              label="Group name"
              error={errors?.name?.message ?? null}
              placeholder="Enter group name"
            />
            {isCreate && (
              <>
                <br />
                <div className="flex justify-start gap-4 items-center">
                  <Toggle
                    onChange={() => {
                      toogle(old => !old)
                    }}
                    toggle={gc}
                  />
                  <span>Enable Group Chat</span>
                </div>
              </>
            )}
          </>
        )
      }}
    />
  )
}

const DeleteModalContent = ({ selected }) => {
  return (
    <div className="w-full text-base leading-7">
      <div className="mb-4 px-4 pt-4">
        <p>
          <span className="font-bold">
            <FaExclamationCircle className="inline-flex text-danger-700" />{' '}
            {`Warning: `}
          </span>
          {`You're about to delete the group `}
          <span className="font-bold">{`${selected?.name}`}</span>.
        </p>
      </div>
      <div className="-mx-4 mb-4 p-4 bg-blue-100">
        <ul className="list-disc px-12">
          <li className="mb-2">{`This will remove the group from existing members.`}</li>
          <li className="mb-2">{`This action will delete the ${selected?.name} chat group after 30 days.`}</li>
        </ul>
      </div>
      <p className="px-4 pt-2 pb-4">{`Are you sure you want to delete this group?`}</p>
    </div>
  )
}

const Groups = () => {
  const router = useRouter()
  const profile = JSON.parse(localStorage.getItem('profile'))
  const companyID = profile.accounts.data[0].company._id
  const [groups, setGroups] = useState()
  // const [searchText, setSearchText] = useState('')
  const [modalState, setModalState] = useState(defaultModalState)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [shouldCreateGC, setShouldCreateGC] = useState(true)

  const { loading, data, error, refetch } = useQuery(GET_COMPANY_GROUPS, {
    enabled: false,
    variables: {
      where: {
        companyId: companyID,
        status: 'active'
      }
    }
  })

  const [
    createCompanyGroup,
    { loading: createLoading, data: createData, error: createError }
  ] = useMutation(CREATE_COMPANY_GROUP)

  const [
    updateCompanyGroup,
    { loading: updateLoading, data: updateData, error: updateError }
  ] = useMutation(UPDATE_COMPANY_GROUP)

  const [
    deleteCompanyGroup,
    { loading: deleteLoading, data: deleteData, error: deleteError }
  ] = useMutation(DELETE_COMPANY_GROUP)

  const { control, errors } = useForm({
    resolver: yupResolver(SCHEMA)
  })

  // const onSearch = debounce(e => {
  //   setSearchText(e.target.value !== '' ? e.target.value : null)
  // }, 1000)

  // const onClearSearch = () => {
  //   setSearchText(null)
  // }

  const onSubmit = val => {
    if (!isEmpty(val)) {
      if (modalState.type === 'add')
        createCompanyGroup({
          variables: {
            companyId: companyID,
            createGroupConversation: shouldCreateGC,
            data: {
              name: val?.name,
              status: 'active'
            }
          }
        })

      if (modalState.type === 'edit')
        updateCompanyGroup({
          variables: {
            companyGroupId: selectedGroup?._id,
            data: {
              name: val?.name
            }
          }
        })
    } else {
      deleteCompanyGroup({
        variables: {
          companyGroupId: selectedGroup?._id
        }
      })
    }
  }

  const closeModal = () => {
    setModalState({
      ...modalState,
      visible: false
    })
    setSelectedGroup(null)
  }

  useEffect(() => {
    if (!createLoading && !updateLoading && !deleteLoading) {
      if (
        (createData && !createError) ||
        (updateData && !updateError) ||
        (deleteData && !deleteError)
      ) {
        showToast(
          'success',
          `Successfully ${
            createData ? 'added' : updateData ? 'updated' : 'deleted'
          } a new group`
        )
        closeModal()
        refetch()
      }

      if ((!createData && createError) || (!updateData && updateError)) {
        const err = createError || updateError
        errorHandler(err)
      }
    }
  }, [
    createLoading,
    createData,
    createError,
    updateLoading,
    updateData,
    updateError,
    deleteLoading,
    deleteData,
    deleteError
  ])

  useEffect(() => {
    if (!loading)
      if (error) {
        errorHandler(error)
      } else if (data) {
        const tableData = {
          data:
            data?.getCompanyGroups?.map(item => {
              const dropdownData = [
                {
                  label: 'View',
                  function: () => router.push(`/members/groups/${item?._id}`)
                },
                {
                  label: 'Edit',
                  function: () => {
                    setModalState({
                      type: 'edit',
                      visible: true,
                      okText: 'Update',
                      title: 'Edit Group'
                    })
                    setSelectedGroup(item)
                  }
                },
                {
                  label: 'Delete',
                  function: () => {
                    setModalState({
                      type: 'delete',
                      visible: true,
                      okText: 'Yes, delete group',
                      title: 'Delete Group'
                    })
                    setSelectedGroup(item)
                  }
                }
              ]

              return {
                name: item?.name,
                button: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            }) || null
        }

        setGroups(tableData)
      }
  }, [loading, data, error])

  return (
    <section className="content-wrap">
      <h1 className="content-title">Manage Groups</h1>

      {/* <div className="flex items-center justify-end mt-12 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row flex-row-reverse">
          <SearchControl
            placeholder="Search"
            searchText={searchText}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      </div> */}

      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-4 py-4">{`Groups`}</h1>
        <div className="flex items-center">
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Create New Group"
            onClick={() =>
              setModalState({
                ...defaultModalState,
                visible: true
              })
            }
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card
        content={
          <Table rowNames={tableRowNames} items={groups} loading={loading} />
        }
      />

      <Modal
        title={modalState.title}
        onClose={closeModal}
        okText={modalState.okText}
        okButtonProps={{
          danger: modalState.type === 'delete',
          disabled: loading || createLoading || updateLoading || deleteLoading
        }}
        visible={modalState.visible}
        onOk={async () => {
          await control.trigger()
          if (isEmpty(errors)) {
            onSubmit(control.getValues())
          }
        }}
        onCancel={closeModal}
      >
        {modalState.visible && (
          <>
            {(modalState.type === 'add' || modalState.type === 'edit') && (
              <AddEditModalContent
                control={control}
                errors={errors}
                selected={selectedGroup}
                isCreate={modalState.type === 'add'}
                gc={shouldCreateGC}
                toogle={setShouldCreateGC}
              />
            )}

            {modalState.type === 'delete' && (
              <DeleteModalContent selected={selectedGroup} control={control} />
            )}
          </>
        )}
      </Modal>
    </section>
  )
}

AddEditModalContent.propTypes = {
  selected: Props.object,
  control: Props.any,
  errors: Props.object,
  isCreate: Props.boolean,
  gc: Props.boolean,
  toogle: Props.func
}

DeleteModalContent.propTypes = {
  selected: Props.object
}

export default Groups
