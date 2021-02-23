/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { FaEllipsisH, FaPlusCircle, FaInfoCircle } from 'react-icons/fa'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

import Tabs from '@app/components/tabs'
import Card from '@app/components/card'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import PageLoader from '@app/components/page-loader'

import showToast from '@app/utils/toast'

import CreateModal from '../components/complex/createModal'
import EditModal from '../components/complex/editModal'
import DeleteModal from '../components/complex/deleteModal'
import EditModalCompany from '../components/company/editModal'

import styles from './index.module.css'

const GET_COMPANIES_QUERY = gql`
  query getCompanies($where: GetCompaniesParams, $limit: Int, $skip: Int) {
    getCompanies(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
        avatar
        email
        contactNumber
        tinNumber
        complexLimit
        buildingLimit
        address {
          formattedAddress
          city
        }
        companyAdministrators(limit: 1) {
          data {
            user {
              _id
              firstName
              lastName
              email
            }
          }
        }
        complexes {
          count
        }
        buildings {
          count
        }
      }
    }
  }
`

const GET_COMPLEXES_QUERY = gql`
  query getComplexes($where: GetComplexesParams, $limit: Int, $skip: Int) {
    getComplexes(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
        avatar
        address {
          formattedAddress
          city
        }
        company {
          name
        }
        complexAdministrators(limit: 1) {
          data {
            user {
              _id
              firstName
              lastName
              email
            }
          }
        }
        buildings {
          count
        }
      }
    }
  }
`

const CREATE_COMPLEX_MUTATION = gql`
  mutation createComplex(
    $data: InputComplex
    $admin: InputAdmin
    $companyId: String
  ) {
    createComplex(data: $data, admin: $admin, companyId: $companyId) {
      _id
      processId
      message
    }
  }
`

const UPDATE_COMPLEX_MUTATION = gql`
  mutation updateComplex($data: InputUpdateComplex, $complexId: String) {
    updateComplex(data: $data, complexId: $complexId) {
      _id
      processId
      message
    }
  }
`

const DELETE_COMPLEX_MUTATION = gql`
  mutation deleteComplex($data: InputDeleteComplex) {
    deleteComplex(data: $data) {
      _id
      processId
      message
    }
  }
`

const UPDATE_COMPANY_MUTATION = gql`
  mutation updateCompany($data: InputUpdateCompany, $companyId: String) {
    updateCompany(data: $data, companyId: $companyId) {
      _id
      processId
      message
    }
  }
`

const ComplexDataComponent = () => {
  const router = useRouter()
  const [companies, setCompanies] = useState()
  const [companyProfile, setCompanyProfile] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState()
  const profile = JSON.parse(localStorage.getItem('profile'))

  const goToComplexData = id => {
    router.push(`/properties/complex/${id}/overview`)
  }

  const companyDropdownData = [
    {
      label: 'Edit Company',
      icon: <FiEdit2 />,
      function: () => handleShowModal('edit_company', companyProfile)
    }
  ]

  const tableRowNames = [
    {
      name: 'Complex Name',
      width: '30%'
    },
    {
      name: 'Company Name',
      width: '30%'
    },
    {
      name: '# of Buildings',
      width: '15%'
    },
    {
      name: 'Point of Contact',
      width: '20%'
    },
    {
      name: '',
      width: ''
    }
  ]

  const { loading, data, error, refetch } = useQuery(GET_COMPLEXES_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: 'active'
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const {
    loading: loadingProfile,
    data: dataProfile,
    error: errorProfile,
    refetch: refetchProfile
  } = useQuery(GET_COMPANIES_QUERY, {
    enabled: false,
    variables: {
      where: {
        _id: profile.accounts.data[0].company._id
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const [
    createComplex,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_COMPLEX_MUTATION)

  const [
    updateComplex,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_COMPLEX_MUTATION)

  const [
    deleteComplex,
    {
      loading: loadingDelete,
      called: calledDelete,
      data: dataDelete,
      error: errorDelete
    }
  ] = useMutation(DELETE_COMPLEX_MUTATION)

  const [
    updateCompany,
    {
      loading: loadingUpdateCompany,
      called: calledUpdateCompany,
      data: dataUpdateCompany,
      error: errorUpdateCompany
    }
  ] = useMutation(UPDATE_COMPANY_MUTATION)

  useEffect(() => {
    refetch()
    refetchProfile()
  }, [])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data) {
        const tableData = {
          count: data?.getComplexes.count || 0,
          limit: data?.getComplexes.limit || 0,
          offset: data?.getComplexes.skip || 0,
          data:
            data?.getComplexes?.data.map(item => {
              const dropdownData = [
                {
                  label: 'Edit Complex',
                  icon: <FiEdit2 />,
                  function: () => handleShowModal('edit', item)
                },
                {
                  label: 'Delete Complex',
                  icon: <FiTrash2 />,
                  function: () => handleShowModal('delete', item)
                },
                {
                  label: 'More Details',
                  icon: <FaInfoCircle />,
                  function: () => goToComplexData(item?._id)
                }
              ]

              return {
                name: (
                  <span
                    className={styles.ContentLink}
                    onClick={() => goToComplexData(item?._id)}
                  >
                    {item?.name}
                  </span>
                ),
                company: item?.company?.name,
                buildingNo: item?.buildings?.count,
                contact: item?.complexAdministrators?.data[0] ? (
                  <div className="flex flex-col items-start">
                    <span>{`${item?.complexAdministrators?.data[0]?.user?.firstName} ${item?.complexAdministrators?.data[0]?.user?.lastName}`}</span>
                    <span className="text-neutral-500 text-sm">
                      {item?.complexAdministrators?.data[0]?.user?.email}
                    </span>
                  </div>
                ) : (
                  'Not available'
                ),
                button: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            }) || null
        }

        setCompanies(tableData)
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingProfile) {
      if (errorProfile) {
        errorHandler(errorProfile)
      } else if (dataProfile) {
        setCompanyProfile(dataProfile?.getCompanies?.data[0])
      }
    }
  }, [loadingProfile, dataProfile, errorProfile])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        showToast('success', 'You have successfully created a complex.')
        onCancel()
        refetch()
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate])

  useEffect(() => {
    if (!loadingUpdate) {
      if (errorUpdate) {
        errorHandler(errorCreate)
      }
      if (calledUpdate && dataUpdate) {
        showToast('success', 'You have successfully updated a complex.')
        onCancel()
        refetch()
      }
    }
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate])

  useEffect(() => {
    if (!loadingDelete) {
      if (errorDelete) {
        errorHandler(errorDelete)
      }
      if (calledDelete && dataDelete) {
        showToast('success', 'You have successfully deleted a complex.')
        onCancel()
        refetch()
      }
    }
  }, [loadingDelete, calledDelete, dataDelete, errorDelete])

  useEffect(() => {
    if (!loadingUpdateCompany) {
      if (errorUpdateCompany) {
        errorHandler(errorUpdateCompany)
      }
      if (calledUpdateCompany && dataUpdateCompany) {
        showToast('success', 'You have successfully updated a company.')
        onCancel()
        refetchProfile()
      }
    }
  }, [
    loadingUpdateCompany,
    calledUpdateCompany,
    dataUpdateCompany,
    errorUpdateCompany
  ])

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError) {
        if (networkError?.result?.errors[0]?.code === 4000) {
          showToast('danger', 'Category name already exists')
        } else {
          showToast('danger', errors?.networkError?.result?.errors[0]?.message)
        }
      }
    }
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(e * limitPage - 10)
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
  }

  const onSubmit = async (type, data) => {
    try {
      if (type === 'create') {
        const createData = {
          companyId: router?.query?.id ?? data?.company?.value,
          data: {
            name: data?.name,
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            }
          },
          admin: {
            email: data?.email,
            jobTitle: data?.jobtitle
          }
        }
        await createComplex({ variables: createData })
      } else if (type === 'edit') {
        const updateData = {
          complexId: data?.id,
          data: {
            name: data.name,
            avatar: data?.logo[0],
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            }
          }
        }
        await updateComplex({ variables: updateData })
      } else if (type === 'delete') {
        const deleteData = {
          data: {
            complexId: data?._id
          }
        }
        await deleteComplex({ variables: deleteData })
      } else if (type === 'edit_company') {
        const updateData = {
          companyId: router.query.id,
          data: {
            name: data.name,
            avatar: data?.logo[0],
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            },
            email: data?.email,
            contactNumber: data?.contact,
            tinNumber: data?.tin
          }
        }
        await updateCompany({ variables: updateData })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onCancel = () => {
    setShowModal(false)
  }

  const handleShowModal = (type, data) => {
    setModalType(type)

    switch (type) {
      case 'create': {
        setModalTitle('Add Complex')
        setModalData(null)
        break
      }
      case 'edit': {
        setModalTitle('Edit Complex')
        setModalData(data)
        break
      }
      case 'delete': {
        setModalTitle('Delete Complex')
        setModalData(data)
        break
      }
    }
    setShowModal(old => !old)
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderContainer}>
        <div className="flex items-center">
          <div className={styles.PageHeaderLogo}>
            <img alt="logo" src={companyProfile?.avatar ?? ''} />
          </div>
          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>{companyProfile?.name ?? ''}</h1>
            <h2 className={styles.PageHeaderSmall}>Complex</h2>
          </div>
        </div>

        <div className={styles.PageButton}>
          <Dropdown label={<FaEllipsisH />} items={companyDropdownData} />
        </div>
      </div>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Complexes</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <Card
              noPadding
              header={
                <div className={styles.ContentFlex}>
                  <span className={styles.CardHeader}>Complexes</span>
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Add Complex"
                    onClick={() => handleShowModal('create')}
                  />
                </div>
              }
              content={
                loading ? (
                  <PageLoader />
                ) : (
                  companies && (
                    <Table rowNames={tableRowNames} items={companies} />
                  )
                )
              }
            />
            {!loading && data && companies && (
              <Pagination
                items={companies}
                activePage={activePage}
                onPageClick={onPageClick}
                onLimitChange={onLimitChange}
              />
            )}
            {showModal &&
              (modalType === 'create' ? (
                <CreateModal
                  processType={modalType}
                  title={modalTitle}
                  data={modalData}
                  isShown={showModal}
                  onSave={e => onSubmit(modalType, e)}
                  onCancel={onCancel}
                />
              ) : modalType === 'edit' ? (
                <EditModal
                  processType={modalType}
                  title={modalTitle}
                  data={modalData}
                  isShown={showModal}
                  onSave={e => onSubmit(modalType, e)}
                  onCancel={onCancel}
                />
              ) : modalType === 'delete' ? (
                <DeleteModal
                  processType={modalType}
                  title={modalTitle}
                  data={modalData}
                  isShown={showModal}
                  onSave={() => onSubmit(modalType, modalData)}
                  onCancel={onCancel}
                />
              ) : modalType === 'edit_company' ? (
                <EditModalCompany
                  processType={modalType}
                  title={modalTitle}
                  data={modalData}
                  isShown={showModal}
                  onSave={e => onSubmit(modalType, e)}
                  onCancel={onCancel}
                />
              ) : null)}
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default ComplexDataComponent
