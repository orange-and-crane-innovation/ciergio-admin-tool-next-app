import { useState, useEffect, useMemo } from 'react'
import Table from '@app/components/table'
import Card from '@app/components/card'
import Button from '@app/components/button'
import PageLoader from '@app/components/page-loader'
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa'
import Modal from '@app/components/modal'
import FormSelect from '@app/components/forms/form-select'
import { useQuery, useMutation } from '@apollo/client'
import * as Query from './Query'
import * as Mutation from './Mutation'
import P from 'prop-types'
import showToast from '@app/utils/toast'
import Can from '@app/permissions/can'

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
    selectChange(selected.value)
  }

  return (
    <FormSelect
      placeholder="Select"
      onChange={onCategorySelect}
      options={categories}
      label="Category Name"
      classNames="w-full"
      name="category"
      noOptionsMessage={() => 'No item found.'}
    />
  )
}

function ManageCategories({ complexID, accountType }) {
  const [selectedCategory, setSelectedCategory] = useState()
  const [showModal, setShowModal] = useState(false)

  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)

  const [
    deleteBillCategory,
    {
      loading: loadingDeleteBillCategory,
      called: calledDeleteBillCategory,
      data: dataDeleteBillCategory
    }
  ] = useMutation(Mutation.REMOVE_ALLOWED_CATEGORY)

  const [
    addBillCategory,
    {
      loading: loadingAddCategory,
      called: calledAddBillCategory,
      data: dataAddBillCategory
    }
  ] = useMutation(Mutation.SAVE_ALLOWED_CATEGORY)

  const { loading, data } = useQuery(Query.GET_CATEGORIES, {
    variables: {
      where: null
    }
  })

  const {
    loading: loadingAllowedCategory,
    data: dataAllowedCategory,
    refetch: refetchAllowedCategory
  } = useQuery(Query.GET_ALLOWED_CATEGORIES, {
    variables: {
      where: {
        accountId: complexID,
        accountType: 'company'
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

  useEffect(() => {
    if (
      !loadingDeleteBillCategory &&
      calledDeleteBillCategory &&
      dataDeleteBillCategory
    ) {
      if (dataDeleteBillCategory?.removeBillCategory?.message === 'success') {
        showToast('success', 'You have successfully removed a bill category')
        setShowModal(false)
        setDeleteCategoryModal(false)
        setDeleteItemId(null)
        refetchAllowedCategory()
      }
    }
  }, [
    loadingDeleteBillCategory,
    calledDeleteBillCategory,
    dataDeleteBillCategory
  ])

  const onDeleteBill = e => {
    e.preventDefault()
    setDeleteItemId(e.target.name)
    setShowModal(show => !show)
    setDeleteCategoryModal(true)
  }

  const tableAllowedCategory = useMemo(() => {
    if (!loadingAllowedCategory) {
      const table = _.map(
        dataAllowedCategory?.getAllowedBillCategory?.data,
        function (value) {
          return _.map(value.categories, function (val) {
            return {
              [`${val._id}`]: (
                <ColorWithLabel
                  key={val._id}
                  color={val.color}
                  name={val.name}
                />
              ),
              delButton: (
                <Can
                  perform="dues:categories:delete"
                  yes={
                    <Button
                      name={val._id}
                      onClick={onDeleteBill}
                      icon={<FaTrashAlt size="14" value="ad" name={val._id} />}
                    />
                  }
                  no={
                    <Button
                      name={val._id}
                      disabled
                      icon={<FaTrashAlt size="14" value="ad" name={val._id} />}
                    />
                  }
                />
              )
            }
          })
        }
      )

      return { data: table[0] || [] }
    }
  }, [loadingAllowedCategory, dataAllowedCategory, refetchAllowedCategory])

  const optionsCategory = useMemo(() => {
    if (!loading && !loadingAllowedCategory) {
      const existedCategories = {}
      _.forEach(
        dataAllowedCategory?.getAllowedBillCategory?.data,
        function (value) {
          return _.forEach(value.categories, function (val) {
            existedCategories[`${val._id}`] = val._id
          })
        }
      )

      const filteredCategories = []
      data?.getBillCategory?.category?.forEach((item, index) => {
        if (!existedCategories[item._id]) {
          filteredCategories.push({
            label: <ColorWithLabel name={item?.name} color={item?.color} />,
            value: item?._id
          })
        }
      })

      return filteredCategories
    }
  }, [
    loading,
    data,
    dataAllowedCategory,
    loadingAllowedCategory,
    refetchAllowedCategory
  ])

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleOkModal = async () => {
    if (!deleteCategoryModal) {
      try {
        if (selectedCategory || selectedCategory !== '') {
          await addBillCategory({
            variables: {
              accountType: 'company',
              accountId: complexID,
              categoryIds: [selectedCategory]
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        if (deleteItemId || deleteItemId !== '') {
          await deleteBillCategory({
            variables: {
              accountType: 'company',
              accountId: complexID,
              categoryIds: [deleteItemId]
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
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
                <Can
                  perform="dues:create"
                  yes={
                    <Button
                      primary
                      onClick={e => setShowModal(show => !show)}
                      label="Add Category"
                      leftIcon={<FaPlusCircle size="13" />}
                    />
                  }
                  no={
                    <Button
                      primary
                      disabled
                      label="Add Category"
                      leftIcon={<FaPlusCircle size="13" />}
                    />
                  }
                />
              </div>
            </div>
          }
          content={
            !loadingAllowedCategory ? (
              <Table
                items={tableAllowedCategory || []}
                emptyText="No Categories added"
              />
            ) : (
              <PageLoader />
            )
          }
        />
      </div>

      <Modal
        title={deleteCategoryModal ? null : 'Add Category'}
        okText="Apply"
        visible={showModal}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onOk={handleOkModal}
      >
        <div>
          {deleteCategoryModal ? (
            <div className="p-10">
              <p className="text-gray-400 text-3xl">
                Do you want to remove this category? Warning: This cannot be
                undone and all existing and past dues for this category will
                also be deleted.
              </p>
            </div>
          ) : (
            optionsCategory && (
              <SelectInput
                categories={optionsCategory}
                selectChange={handleSelectChange}
              />
            )
          )}
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
