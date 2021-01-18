/* eslint-disable react/jsx-key */
import React, { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Link from 'next/link'

import { Card, Tabs } from '@app/components/globals'
import Table from '@app/components/table'
import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'

import ManageDirectory from './ManageDirectory'
import { FaPlusCircle } from 'react-icons/fa'

import { GET_COMPANIES, GET_CONTACT_CATEGORY, CREATE_CATEGORY } from './queries'

const validationSchema = yup.object().shape({
  category_name: yup.string().label('New Category Name').required()
})

function Directory() {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      category_name: ''
    }
  })

  const { data: companies } = useQuery(GET_COMPANIES)
  const { data: categories, refetch: refetchCategories } = useQuery(
    GET_CONTACT_CATEGORY
  )
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      handleClearModal()
      refetchCategories()
    }
  })
  const [newCategory, setNewCategory] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    if (newCategory !== '') {
      setNewCategory('')
    }

    handleShowModal()
  }

  const handleOk = values => {
    createCategory({ variables: { data: { name: values.category_name } } })
  }

  // const handleInputChange = e => console.log(e.target.value)

  const columns = useMemo(
    () => [
      {
        name: 'Name',
        width: ''
      }
    ],
    []
  )

  const directoryData = useMemo(
    () => ({
      count: companies?.getCompanies.count || 0,
      limit: companies?.getCompanies.limit || 0,
      data:
        companies?.getCompanies?.data?.map(item => {
          return {
            name: (
              <Link href={`/directory/companies/${item._id}`}>
                <span className="text-blue-600 cursor-pointer">
                  {item.name}
                </span>
              </Link>
            )
          }
        }) || []
    }),
    [companies?.getCompanies]
  )

  const directoryCategories = useMemo(() => {
    const cats = categories?.getContactCategories?.data

    if (cats?.length > 0) {
      return cats.map(c => ({
        name: c.name
      }))
    }
  }, [categories?.getContactCategories?.data])

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title">Directory</h1>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Directory</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Manage Directory</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-base px-8 py-4">Companies</h1>
            </div>
            <Card
              noPadding
              header={
                <div className="flex items-center justify-between">
                  <span>Companies</span>
                </div>
              }
              content={<Table rowNames={columns} items={directoryData} />}
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <div className="w-full flex items-center justify-end pt-4">
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Category"
                onClick={() => setShowModal(old => !old)}
              />
            </div>
            <Card
              noPadding
              content={<ManageDirectory data={directoryCategories} />}
            />
            {showModal ? (
              <Modal
                title="Add Category"
                okText="Add"
                visible={showModal}
                onClose={handleClearModal}
                onCancel={handleClearModal}
                onOk={handleSubmit(handleOk)}
              >
                <div className="w-full">
                  <form>
                    <Controller
                      name="category_name"
                      control={control}
                      render={({ value, onChange, name }) => (
                        <FormInput
                          name={name}
                          label="New Category Name"
                          placeholder="Enter new category"
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </form>
                </div>
              </Modal>
            ) : null}
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Directory
