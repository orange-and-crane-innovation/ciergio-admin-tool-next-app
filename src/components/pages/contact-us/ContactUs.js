import React, { useState } from 'react'
import { Card, Table, Draggable } from '@app/components/globals'
import Button from '@app/components/button'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'

import { FaPlusCircle } from 'react-icons/fa'

const tableRowData = [
  {
    name: 'Title',
    width: '40%'
  },
  {
    name: 'Name',
    width: '20%'
  },
  {
    name: 'Email',
    width: ''
  }
]

let tableData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: [
    {
      title: 'Complex Administrator',
      name: 'Ashlynn Arias',
      email: 'ashlynn.arias@ciergio.com'
    },
    {
      title: 'Head Receptionist',
      name: 'Tori Corleone',
      email: 'tori.corleone@ciergio.com'
    },
    {
      title: 'Maintenance Officer',
      name: 'All Saab',
      email: 'all.saab@ciergio.com'
    }
  ]
}

const bulkOptions = [
  {
    label: 'Unpublished',
    value: 'unpublish'
  },
  {
    label: 'Move to Trash',
    value: 'trash'
  }
]

function ContactUs() {
  const [list, setList] = useState(() => {
    return tableData.data.map((d, index) => ({
      ...d,
      id: index
    }))
  })

  const [reorder, setReorder] = useState(false)
  return (
    <section className={`content-wrap`}>
      <h1 className="content-title">Contact Page</h1>
      <span className="text-sm">
        Allow users to email specific people in your building
      </span>

      <div className="flex items-center justify-between mt-12 flex-col md:flex-row">
        <div className="flex items-center justify-between w-full md:w-1/4">
          <FormSelect options={bulkOptions} />
          <Button type="button" label="Apply" className="ml-2" />
        </div>
        <div>
          <FormInput
            type="text"
            placeholder="Search"
            leftIcon="ciergio-search"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-between pt-4 pr-4 bg-white border rounded">
        <div className="flex items-center pl-8 font-bold text-base leading-relaxed">
          <h3>{reorder ? 'Reorder Contacts' : `Directory (${list.length})`}</h3>
        </div>
        <div className="flex items-center">
          {reorder ? (
            <>
              <Button
                default
                label="Cancel"
                onClick={() => setReorder(old => !old)}
                className="mr-4"
              />
              <Button
                primary
                label="Save"
                onClick={() => {
                  tableData = {
                    ...tableData,
                    data: list
                  }
                  setReorder(old => !old)
                }}
              />
            </>
          ) : (
            <>
              <Button
                default
                label="Reorder"
                onClick={() => setReorder(old => !old)}
                className="mr-4"
              />
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Category"
                onClick={() => {}}
              />
            </>
          )}
        </div>
      </div>
      <Card
        content={
          reorder ? (
            <Draggable
              list={list}
              onListChange={setList}
              rowNames={tableRowData}
            />
          ) : (
            <Table rowNames={tableRowData} items={tableData} />
          )
        }
      />
    </section>
  )
}

export default ContactUs
