import React, { useState, useMemo } from 'react'
import P from 'prop-types'
import { useLazyQuery, useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Button from '@app/components/button'
import FormSelect from '@app/components/forms/form-select'
import Search from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'
import { Card } from '@app/components/globals'
import axios from '@app/utils/axios'
import showToast from '@app/utils/toast'
import CreateTicketModal from './CreateTicketModal'
import TicketsTable from './TicketsTab'
import { FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import { GET_UNITS, CREATE_ISSUE } from '../queries'
import { ACCOUNT_TYPES } from '@app/constants'

export const createTicketValidation = yup.object().shape({
  unitNumber: yup.string().required(),
  requestor: yup.string().required(),
  category: yup.string().required(),
  title: yup.string().required()
})

function Component({
  title,
  type,
  columns,
  category,
  staff,
  searchText,
  staffOptions,
  onCategoryChange,
  onClearCategory,
  onClearSearch,
  onSearchTextChange,
  onStaffChange,
  onClearStaff,
  buildingId,
  companyId,
  complexId,
  profileId
}) {
  const { handleSubmit, control, errors, register, setValue, watch } = useForm({
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
  const [imageUploadedData, setImageUploadedData] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
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
  register({ name: 'embeddedFiles' })
  const handleShowModal = () => setShowCreateTicketModal(old => !old)
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
          content,
          categoryId,
          reporterAccountId,
          unitId,
          title,
          companyId,
          complexId,
          authorAccountId: profileId,
          assigneeAccountId: [staff?.value],
          mediaAttachments: imageUploadedData
        }
      }
    })
  }

  const uploadApi = async payload => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const response = await axios.post('/', payload, config)
    if (response.data) {
      const imageData = response.data.map(item => {
        return {
          url: item.location,
          type: item.mimetype
        }
      })
      setImageUploadedData(imageData)
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
        reader.onloadend = () => {
          setImageUrls(imageUrls => [...imageUrls, reader.result])
          setIsUploading(false)
        }
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
    setImageUrls(images)
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
            options={staffOptions}
            value={staff?.value}
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
            key="print"
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />,
          <Button
            key="export"
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />,
          <Button
            key="create"
            primary
            leftIcon={<FaPlusCircle />}
            label="Create Ticket"
            onClick={() => {
              fetchUnits()
              handleShowModal()
            }}
            className="mr-4 mt-4"
          />
        ]}
        noPadding
        content={
          <TicketsTable
            type={type}
            columns={columns}
            staffId={staff?.value}
            buildingId={buildingId}
            categoryId={category}
            searchText={searchText}
            isMutationSuccess={called && !loading & data & !error}
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
  staff: P.object,
  searchText: P.string,
  onCategoryChange: P.func,
  onSearchTextChange: P.func,
  onClearSearch: P.func,
  onClearCategory: P.func,
  onStaffChange: P.func,
  onClearStaff: P.func,
  type: P.string,
  columns: P.array,
  buildingId: P.string,
  complexId: P.string,
  companyId: P.string,
  profileId: P.string
}

export default Component
