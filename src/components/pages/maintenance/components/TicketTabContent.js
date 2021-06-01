import React, { useState, useMemo } from 'react'
import P from 'prop-types'
import { useLazyQuery, useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { FaPlusCircle } from 'react-icons/fa'

import Button from '@app/components/button'
import FormSelect from '@app/components/forms/form-select'

import Search from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'
import { Card } from '@app/components/globals'

import axios from '@app/utils/axios'
import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

import CreateTicketModal from './CreateTicketModal'
import TicketsTable from './TicketsTab'

import { GET_UNITS, CREATE_ISSUE } from '../queries'

export const createTicketValidation = yup.object().shape({
  unitNumber: yup.string().label('Unit No.').required(),
  requestor: yup.string().label('Requestor').required(),
  category: yup.string().label('Category').required(),
  title: yup.string().label('Title').required(),
  content: yup.string().label('Content').required()
})

function Component({
  title,
  type,
  columns,
  category,
  staff,
  searchText,
  staffOptions,
  buildingId,
  companyId,
  complexId,
  profileId,
  onCategoryChange,
  onClearCategory,
  onClearSearch,
  onSearchTextChange,
  onStaffChange,
  onClearStaff
}) {
  const { handleSubmit, control, errors, register, setValue, watch, reset } =
    useForm({
      resolver: yupResolver(createTicketValidation),
      defaultValues: {
        unitNumber: '',
        requestor: '',
        category: '',
        title: '',
        staffId: '',
        content: ''
      }
    })
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false)
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])

  register({ name: 'embeddedFiles' })

  const [fetchUnits, { data: units }] = useLazyQuery(GET_UNITS, {
    variables: {
      where: {
        occupied: true,
        vacant: false,
        buildingId
      }
    }
  })

  const [createIssue, { data, loading, called, error }] = useMutation(
    CREATE_ISSUE,
    {
      onCompleted: () => {
        handleShowModal()
        showToast('success', `Ticket created.`)
      }
    }
  )

  const handleShowModal = () => {
    reset()
    setShowCreateTicketModal(old => !old)
  }

  const handleOk = values => {
    const {
      unitNumber: unitId,
      requestor: reporterAccountId,
      category: categoryId,
      title,
      staff,
      content
    } = values

    createIssue({
      variables: {
        data: {
          buildingId,
          content: content === '' ? null : content,
          categoryId,
          reporterAccountId,
          unitId,
          title,
          companyId,
          complexId,
          authorAccountId: profileId,
          assigneeAccountId: staff ? staff?.map(item => item.value) : null,
          mediaAttachments: imageUploadedData
        }
      }
    })
  }

  const uploadApi = async payload => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'company-id':
          accountType === ACCOUNT_TYPES.SUP.value ? 'oci' : companyID
      }
    }

    const response = await axios.post('/', payload, config)
    if (response.data) {
      response.data.map(item => {
        setImageUrls(prevArr => [...prevArr, item.location])
        return setImageUploadedData(prevArr => [
          ...prevArr,
          {
            url: item.location,
            type: item.mimetype
          }
        ])
      })
      setIsUploading(false)
    }
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []
    if (files) {
      setIsUploading(true)
      for (const file of files) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        formData.append('photos', file)
        fileList.push(file)
      }
      setValue('images', fileList)
      uploadApi(formData)
    }
  }

  const onRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
    const uploadedImages = imageUploadedData.filter(image => {
      return image.url !== e.currentTarget.dataset.id
    })
    setImageUrls(images)
    setImageUploadedData(uploadedImages)
    setValue('images', images.length !== 0 ? images : null)
  }

  const unitOptions = useMemo(() => {
    if (units?.getUnits?.data?.length > 0) {
      return units.getUnits?.data?.map(unit => ({
        label: unit.name,
        value: unit._id
      }))
    }
    return []
  })

  return (
    <>
      <div className="flex justify-end w-full">
        <div className="flex items-center w-7/12">
          <FormSelect
            options={staffOptions || []}
            value={
              staffOptions
                ? staffOptions.filter(item => item.value === staff?.value)
                : null
            }
            onChange={onStaffChange}
            onClear={onClearStaff}
            placeholder="Filter assignee"
            className="mr-4"
            isClearable
          />
          <div className="mr-4 w-full">
            <SelectCategory
              type="issue"
              selected={category}
              placeholder="Filter category"
              onChange={onCategoryChange}
              onClear={onClearCategory}
            />
          </div>
          <Search
            placeholder="Search by title"
            onSearch={onSearchTextChange}
            searchText={searchText}
            onClearSearch={onClearSearch}
          />
        </div>
      </div>
      <Card
        title={title}
        actions={[
          <Button
            key="create"
            primary
            leftIcon={<FaPlusCircle />}
            label="Create Ticket"
            onClick={() => {
              fetchUnits()
              handleShowModal()
            }}
            className="mr-2"
          />
        ]}
        noPadding
        content={
          <TicketsTable
            type={type}
            columns={columns}
            staffOptions={staffOptions}
            staffId={staff?.value}
            buildingId={buildingId}
            categoryId={category}
            searchText={searchText}
            isMutationSuccess={called && !loading && data && !error}
          />
        }
        className="rounded-t-none"
      />
      <CreateTicketModal
        open={showCreateTicketModal}
        onCancel={handleShowModal}
        onOk={handleSubmit(handleOk)}
        form={{
          errors,
          control,
          watch
        }}
        loading={isUploading}
        imageURLs={imageUrls}
        onUploadImage={onUploadImage}
        onRemoveImage={onRemoveImage}
        residentOptions={[]}
        unitOptions={unitOptions}
        staffOptions={staffOptions}
      />
    </>
  )
}

Component.propTypes = {
  title: P.string,
  content: P.oneOfType([P.node, P.element, null, P.string]),
  staffOptions: P.array,
  categoryOptions: P.array,
  category: P.string,
  staff: P.array,
  searchText: P.string,
  type: P.string,
  columns: P.array,
  buildingId: P.string,
  complexId: P.string,
  companyId: P.string,
  profileId: P.string,
  onCategoryChange: P.func,
  onSearchTextChange: P.func,
  onClearSearch: P.func,
  onClearCategory: P.func,
  onStaffChange: P.func,
  onClearStaff: P.func
}

export default Component
