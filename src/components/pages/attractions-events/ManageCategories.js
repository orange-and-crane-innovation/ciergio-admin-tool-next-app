import { useState, useMemo } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Card } from '@app/components/globals'
import Button from '@app/components/button'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import showToast from '@app/utils/toast'
import {
  GET_ATTRACTIONS_CATEGORIES,
  CREATE_ATTRACTIONS_CATEGORY,
  GET_COMPANIES
} from './queries'
import { createAttractionsCategoryValidation } from './schema'

import CreateCategoryModal from './CreateCategoryModal'

const columns = [
  {
    name: 'Category Name',
    width: ''
  },
  {
    name: 'Company',
    width: ''
  }
]

function ManageCategories() {
  const { handleSubmit, control, errors, reset } = useForm({
    resolver: yupResolver(createAttractionsCategoryValidation),
    defaultValues: {
      name: '',
      company: ''
    }
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)

  const { data: attractions, loading } = useQuery(GET_ATTRACTIONS_CATEGORIES, {
    variables: {
      where: {
        type: 'post'
      },
      limit: pageLimit,
      offset
    }
  })

  const [fetchCompanies, { data: companies }] = useLazyQuery(GET_COMPANIES)

  const [createNewCategory, { loading: creatingNewCategory }] = useMutation(
    CREATE_ATTRACTIONS_CATEGORY,
    {
      onCompleted: () => {
        reset({
          name: '',
          company: ''
        })
        handleCreateModal()
        showToast('success', `You have successfully created a category.`)
      },
      refetchQueries: [
        {
          query: GET_ATTRACTIONS_CATEGORIES,
          variables: {
            where: {
              type: 'post'
            },
            limit: pageLimit,
            offset
          }
        }
      ]
    }
  )

  const categoriesData = useMemo(() => {
    return {
      count: attractions?.getPostCategory?.count,
      limit: attractions?.getPostCategory?.limit,
      offset: attractions?.getPostCategory?.offset,
      data:
        attractions?.getPostCategory?.category.length > 0
          ? attractions.getPostCategory.category.map(category => ({
              name: category?.name,
              company: category?.company?.name || 'n/a'
            }))
          : []
    }
  }, [attractions?.getPostCategory?.count])

  const companyOptions = useMemo(() => {
    if (companies?.getCompanies?.count > 0) {
      return companies.getCompanies.data.map(company => ({
        label: company.name,
        value: company._id
      }))
    }

    return []
  }, [companies?.getCompanies])

  const handleCreateModal = () => setShowCreateCategoryModal(old => !old)

  const handleSubmitNewCategory = values => {
    createNewCategory({
      variables: {
        name: values?.name,
        companyId: values?.company,
        type: 'post'
      }
    })
  }

  return (
    <div className="content-wrap">
      <Card
        noPadding
        title={<h1 className="font-bold text-l">Categories</h1>}
        actions={[
          <Button
            key="add"
            leftIcon={<span className="ciergio-circle-plus" />}
            label="Add Category"
            onClick={() => {
              fetchCompanies({
                variables: {
                  where: {
                    status: 'active'
                  }
                }
              })
              handleCreateModal()
            }}
          />
        ]}
        content={
          <PrimaryDataTable
            columns={columns}
            data={categoriesData}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setPageOffset={setOffset}
            pageLimit={pageLimit}
            setPageLimit={setPageLimit}
          />
        }
      />
      <CreateCategoryModal
        open={showCreateCategoryModal}
        onCancel={handleCreateModal}
        loading={creatingNewCategory}
        onOk={handleSubmit(handleSubmitNewCategory)}
        form={{
          control,
          errors
        }}
        options={companyOptions}
      />
    </div>
  )
}

export default ManageCategories
