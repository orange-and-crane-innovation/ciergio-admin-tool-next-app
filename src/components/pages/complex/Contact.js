import React, { useState } from 'react'
import P from 'prop-types'
import Table from '@app/components/table'
import Button from '@app/components/button'
import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import { Card } from '@app/components/globals'

import { FaPlusCircle } from 'react-icons/fa'

const tableRowData = [
  {
    name: 'Name'
  }
]

const tableData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: [
    {
      title: 'Red Cross'
    },
    {
      title: 'PRHC Headquarters'
    },
    {
      title: 'McDonalds'
    },
    {
      title: 'Suds Laundry Services'
    }
  ]
}

function Contact({ name }) {
  const [showModal, setShowModal] = useState(false)
  const [contacts, setContacts] = useState(tableData)

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = () => {
    setContacts([])

    handleClearModal()
  }

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`${name} Directory`}</h1>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Directory(${tableData.data.length})`}</h1>

        <div className="flex items-center">
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Add Contact"
            onClick={() => setShowModal(old => !old)}
            className="my-4 mx-4"
          />
        </div>
      </div>
      <Card
        noPadding
        content={<Table rowNames={tableRowData} items={contacts} />}
        className="rounded-t-none"
      />
      <Modal
        title="Add a Contact"
        okText="Okay"
        visible={showModal}
        onClose={handleClearModal}
        onCancel={handleClearModal}
        onOk={handleOk}
        cancelText="Close"
      >
        <div className="w-full">
          <h1 className="text-base font-bold mb-4">Contact Details</h1>
          <FormInput
            label="Contact Name"
            placeholder="Enter contact name"
            // onChange={handleInputChange}
            name="category-name"
            // value={newCategory}
          />
          <FormInput
            label="Contact Number"
            placeholder="Enter contact number"
            // onChange={handleInputChange}
            name="category-name"
            // value={newCategory}
          />
          <FormInput
            label="Contact Address"
            placeholder="(optional) Enter contact address"
            // onChange={handleInputChange}
            name="category-name"
            // value={newCategory}
          />
        </div>
      </Modal>
    </section>
  )
}

Contact.propTypes = {
  name: P.string
}

export default Contact
