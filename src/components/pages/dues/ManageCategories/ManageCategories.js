import { useState, useEffect } from 'react'
import Table from '@app/components/table'
import Card from '@app/components/card'
import Button from '@app/components/button'
import PageLoader from '@app/components/page-loader'
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa'
import Modal from '@app/components/modal'
import FormSelect from '@app/components/globals/FormSelect'
import { useQuery, useMutation } from '@apollo/client'
import * as Query from './Query'
import * as Mutation from './Mutation'
import P from 'prop-types'
import showToast from '@app/utils/toast'

const _ = require('lodash')

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

const SelectInput = ({ categories, selectChange }) => {
  const onCategorySelect = selected => {
    selectChange(selected.target.value)
  }
  return (
    <FormSelect
      onChange={onCategorySelect}
      options={categories}
      label="Category Name"
      classNames="w-full"
      name="category"
    />
  )
}

function ManageCategories({ complexID, accountType }) {
  const [selectedCategory, setSelectedCategory] = useState()
  const [showModal, setShowModal] = useState(false)
  const [categories, setCategories] = useState()
  const [allowedCategory, setAllowedCategory] = useState({
    data: []
  })

  useEffect(() => {
    console.log(accountType)
  }, [])

  // const [deleteBillCategory] = useMutation(Mutation.REMOVE_ALLOWED_CATEGORY, {
  //   onCompleted: () => {}
  // })

  const [
    addBillCategory,
    {
      loading: loadingAddCategory,
      called: calledAddBillCategory,
      data: dataAddBillCategory
    }
  ] = useMutation(Mutation.SAVE_ALLOWED_CATEGORY)

  const { loading, data, error } = useQuery(Query.GET_CATEGORIES, {
    variables: {
      where: null
    }
  })

  const {
    loading: loadingAllowedCategory,
    data: dataAllowedCategory,
    error: errorAllowedCategory,
    refetch: refetchAllowedCategory
  } = useQuery(Query.GET_ALLOWED_CATEGORIES, {
    variables: {
      where: {
        accountId: complexID,
        accountType: 'complex'
      }
    }
  })

  useEffect(() => {
    if (!loadingAddCategory && calledAddBillCategory && dataAddBillCategory) {
      if (dataAddBillCategory?.addBillCategory?.message === 'success') {
        showToast('success', 'You have successfully added a bill category')
        setShowModal(false)
        refetchAllowedCategory()
      }
    }
  }, [loadingAddCategory, calledAddBillCategory, dataAddBillCategory])

  const onDeleteBill = () => {}

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
                <FaTrashAlt size="14" id={val._id} onClick={onDeleteBill} />
              )
            })
          })
        }
      )

      setAllowedCategory({
        data: dataTable || []
      })
    }
  }, [
    loadingAllowedCategory,
    dataAllowedCategory,
    errorAllowedCategory,
    refetchAllowedCategory
  ])

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

  const handleOkModal = async () => {
    try {
      if (selectedCategory || selectedCategory !== '') {
        await addBillCategory({
          variables: {
            accountType: accountType,
            accountId: complexID,
            categoryIds: [selectedCategory]
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectChange = category => {
    setSelectedCategory(category)
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
        <div>
          {
            <SelectInput
              categories={categories || []}
              selectChange={handleSelectChange}
            />
          }
        </div>
      </Modal>
    </>
  )
}

export default ManageCategories

ColorWithLabel.propTypes = {
  name: P.string.isRequired,
  color: P.string.isRequired
}

SelectInput.defaultProps = {
  categories: []
}
SelectInput.propTypes = {
  categories: P.array.isRequired,
  selectChange: P.func.isRequired
}

ManageCategories.propTypes = {
  complexID: P.string.isRequired,
  accountType: P.string.isRequired
}
