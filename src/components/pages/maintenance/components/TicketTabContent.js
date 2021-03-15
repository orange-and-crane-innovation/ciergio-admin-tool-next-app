import React, { useState } from 'react'
import P from 'prop-types'
import Button from '@app/components/button'
import Modal from '@app/components/modal'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Uploader from '@app/components/uploader'
import { Card } from '@app/components/globals'

import { FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import { AiOutlineUserAdd } from 'react-icons/ai'

const unitNumbers = [
  {
    label: 'Unit 1',
    value: 'unit-1'
  },
  {
    label: 'Unit 2',
    value: 'unit-2'
  },
  {
    label: 'Unit 3',
    value: 'unit-3'
  }
]

const residentNames = [
  {
    label: 'John Doe',
    value: 'john-doe'
  },
  {
    label: 'Jane Doe',
    value: 'jane-doe'
  }
]

function Component({ title, content }) {
  const [showModal, setShowModal] = useState(false)

  const handleShowModal = () => setShowModal(old => !old)

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-base px-8 py-4">{title}</h1>
        <div className="flex items-center">
          <Button
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            primary
            leftIcon={<FaPlusCircle />}
            label="Create Ticket"
            onClick={handleShowModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card noPadding content={content} className="rounded-t-none" />
      <Modal
        visible={showModal}
        title="Create Ticket"
        onClose={handleShowModal}
        okText="Create Ticket"
        onOk={handleShowModal}
        onCancel={handleShowModal}
      >
        <form>
          <div className="w-full mb-4">
            <h2 className="font-bold text-base mb-4 text-neutral-900">
              Requested By
            </h2>
            <div className="flex w-full justify-between items-center">
              <div className="w-4/12">
                <p className="font-medium mb-1">Unit No.</p>
                <FormSelect options={unitNumbers} placeholder="Unit No." />
              </div>
              <div className="w-8/12 ml-4">
                <p className="font-medium mb-1">Requestor</p>
                <FormSelect
                  options={residentNames}
                  placeholder="Resident's Name"
                />
              </div>
            </div>
          </div>
          <div className="w-full mb-4">
            <h2 className="font-bold text-base mb-4 text-neutral-900">
              About the Issue
            </h2>
            <div className="w-8/12 mb-8">
              <p className="font-medium mb-1">Category</p>
              <FormSelect options={[]} placeholder="Category" />
            </div>
            <div className="w-full mb-8">
              <p className="font-medium mb-1">Title</p>
              <FormInput placeholder="Enter Title" />
            </div>
            <div className="w-full mb-8">
              <p className="font-medium mb-1">Message</p>
              <FormInput placeholder="Give more details about the issue" />
            </div>
            <div className="w-full mb-8">
              <p className="font-medium mb-2">Attach Photo</p>
              <Uploader
                multiple
                files={{}}
                fileUrls={[]}
                loading={false}
                maxFiles={3}
                accept=".pdf, .doc, .docx"
                onUpload={() => {}}
                onRemove={() => {}}
                type="image"
              />
            </div>
            <div className="w-full">
              <p className="font-medium mb-2">Staff in this Photo</p>
              <div className="w-full flex justify-start items-center">
                <div className="w-12 h-12 border border-blue-500 border-dashed rounded-full mr-4 flex justify-center items-center">
                  <AiOutlineUserAdd className="text-blue-500" />
                </div>
                <p className="font-bold text-base text-blue-500">Add Staff</p>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}

Component.propTypes = {
  title: P.string,
  content: P.node || P.string
}

export default Component
