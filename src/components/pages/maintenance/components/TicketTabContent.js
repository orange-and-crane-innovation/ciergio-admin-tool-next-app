import React, { useState, useMemo } from 'react'
import P from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Button from '@app/components/button'
import FormSelect from '@app/components/forms/form-select'
import Search from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'
import { Card } from '@app/components/globals'
import axios from '@app/utils/axios'
import CreateTicketModal from './CreateTicketModal'
import TicketsTable from './TicketsTab'
import { FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import { GET_UNITS } from '../queries'

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
  buildingId
}) {
  const { handleSubmit, control, errors, register, setValue } = useForm({
    resolver: yupResolver(createTicketValidation),
    defaultValues: {
      unitNumber: '',
      requestor: '',
      category: '',
      title: ''
    }
  })
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false)
  const [, setImageUploadedData] = useState(null)
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
  register({ name: 'embeddedFiles' })
  const handleShowModal = () => setShowCreateTicketModal(old => !old)
  const handleOk = values => console.log({ values })

  const uploadApi = async payload => {
    const response = await axios.post('/', payload)

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
          control
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
  buildingId: P.string
}

export default Component
