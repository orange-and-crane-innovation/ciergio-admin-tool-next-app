import { useState, useEffect, useMemo } from 'react'
import Table from '@app/components/table'
import Card from '@app/components/card'
import Button from '@app/components/button'
import PageLoader from '@app/components/page-loader'
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa'
import Modal from '@app/components/modal'
import FormSelect from '@app/components/globals/FormSelect'
import { useQuery } from '@apollo/client'
import * as Query from './Query'
import P from 'prop-types'
import { BiLeftTopArrowCircle } from 'react-icons/bi'

const _ = require('lodash')

const dummyTableData = {
  data: [
    {
      data1: 'Category 1',
      button: (
        <Button default className="text-gray-400">
          <FaTrashAlt size="14" />
        </Button>
      )
    },
    {
      data2: 'Category 2',
      button: (
        <div className="text-gray-400">
          <FaTrashAlt size="14" />
        </div>
      )
    },
    {
      data3: 'Category 3',
      button: (
        <div className="text-gray-400">
          <FaTrashAlt size="14" />
        </div>
      )
    },
    {
      data4: 'Category 4',
      button: (
        <div className="text-gray-400">
          <FaTrashAlt size="14" />
        </div>
      )
    }
  ]
}

const dummyOpttions = [
  {
    label: 'Option 1',
    value: '1'
  },
  {
    label: 'Option 2',
    value: '2'
  },
  {
    label: 'Option 3',
    value: '3'
  }
]

const ColorWithLabel = ({ color, name }) => {
  return (
    <div className="flex flex-row items-center">
      {color && (
        <div
          className="rounded-full h-3 w-3 mr-2"
          style={{ backgroundColor: `${color}` }}
        ></div>
      )}

      {name}
    </div>
  )
}

function ManageCategories({ complexID }) {
  const [onLoading, setOnLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState()
  const [categories, setCategories] = useState()
  const [allowedCategory, setAllowedCategory] = useState({
    data: []
  })

  const { loading, data, error } = useQuery(Query.GET_CATEGORIES, {
    variables: {
      where: null
    }
  })

  const {
    loading: loadingAllowedCategory,
    data: dataAllowedCategory,
    error: errorAllowedCategory
  } = useQuery(Query.GET_ALLOWED_CATEGORIES, {
    variables: {
      where: {
        accountId: complexID,
        accountType: 'complex'
      }
    }
  })

  useEffect(() => {
    if (
      !loadingAllowedCategory &&
      !errorAllowedCategory &&
      dataAllowedCategory
    ) {
      const dataTable = []
      _.forEach(
        dataAllowedCategory?.getAllowedBillCategory?.data,
        function (value) {
          _.forEach(value.categories, function (val) {
            dataTable.push({
              [`${val._id}`]: (
                <ColorWithLabel
                  key={val._id}
                  color={val.color}
                  name={val.name}
                />
              ),
              delButton: (
                <div className="text-gray-400">
                  <FaTrashAlt size="14" />
                </div>
              )
            })
          })
        }
      )

      setAllowedCategory({
        data: dataTable || []
      })
    }
  }, [loadingAllowedCategory, dataAllowedCategory, errorAllowedCategory])

  useEffect(() => {
    if (!loading && !error && data) {
      const dataOptions = []
      data?.getBillCategory?.category?.forEach((item, index) => {
        dataOptions.push({
          label: item?.name,
          value: item?._id
        })
      })
      setCategories(dataOptions)
    }
  }, [loading, data, error])

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const onCategorySelect = category => {
    setSelectedCategory(category)
  }

  const handleOkModal = () => {
    setShowModal(show => !show)
  }

  return (
    <>
      <div className="flex flex-col">
        <p className="font-bold">My Dues</p>
        <p>Building admins send specific bills through categories you add.</p>
      </div>
      <div className="mt-4 w-3/5">
        <Card
          noPadding
          header={
            <div className="flex items-center justify-between">
              <span className="font-heading font-black">Categories</span>
              <div className="flex items-center justify-end flex-col md:flex-row">
                <Button
                  full
                  primary
                  onClick={e => setShowModal(show => !show)}
                  label="Add Category"
                  leftIcon={<FaPlusCircle size="13" />}
                />
              </div>
            </div>
          }
          content={
            !loadingAllowedCategory && allowedCategory.data.length > 0 ? (
              <Table items={allowedCategory || []} />
            ) : (
              <PageLoader />
            )
          }
        />
      </div>

      <Modal
        title="Add Category"
        okText="Apply"
        visible={showModal}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onOk={handleOkModal}
      >
        {!loading && data && (
          <div className="w-full flex flex-col p-4">
            <label htmlFor="category">Category Name</label>
            {categories && (
              <div className="flex items-center justify-end w-full flex-col mw-full md:flex-row">
                <FormSelect
                  onChange={onCategorySelect}
                  options={categories}
                  classNames="mb-4"
                  name="category"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default ManageCategories

ManageCategories.propTypes = {
  complexID: P.string.isRequired
}
