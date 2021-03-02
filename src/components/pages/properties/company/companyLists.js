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
import { IMAGES } from '@app/constants'

import CreateModal from '../components/company/createModal'
import EditModal from '../components/company/editModal'
import DeleteModal from '../components/company/deleteModal'

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

const CREATE_COMPANY_MUTATION = gql`
  mutation createCompany($data: InputCompany, $admin: InputAdmin) {
    createCompany(data: $data, admin: $admin) {
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

const DELETE_COMPANY_MUTATION = gql`
  mutation deleteCompany($data: InputDeleteCompany) {
    deleteCompany(data: $data) {
      _id
      processId
      message
    }
  }
`

const CompanyDataComponent = () => {
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

  const goToCompanyData = id => {
    router.push(`/properties/company/${id}/overview`)
  }

  const companyDropdownData = [
    {
      label: 'Edit Company',
      icon: <FiEdit2 />,
      function: () => handleShowModal('edit', companyProfile)
    }
  ]

  const tableRowNames = [
    {
      name: 'Company Name',
      width: '30%'
    },
    {
      name: '# of Complex',
      width: '15%'
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
      name: 'Subscription',
      width: '20%'
    },
    {
      name: '',
      width: ''
    }
  ]

  const { loading, data, error, refetch } = useQuery(GET_COMPANIES_QUERY, {
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
    createCompany,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_COMPANY_MUTATION)

  const [
    updateCompany,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_COMPANY_MUTATION)

  const [
    deleteCompany,
    {
      loading: loadingDelete,
      called: calledDelete,
      data: dataDelete,
      error: errorDelete
    }
  ] = useMutation(DELETE_COMPANY_MUTATION)

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
          count: data?.getCompanies.count || 0,
          limit: data?.getCompanies.limit || 0,
          offset: data?.getCompanies.skip || 0,
          data:
            data?.getCompanies?.data.map(item => {
              const dropdownData = [
                {
                  label: 'Edit Company',
                  icon: <FiEdit2 />,
                  function: () => handleShowModal('edit', item)
                },
                {
                  label: 'Delete Company',
                  icon: <FiTrash2 />,
                  function: () => handleShowModal('delete', item)
                },
                {
                  label: 'More Details',
                  icon: <FaInfoCircle />,
                  function: () => goToCompanyData(item?._id)
                }
              ]

              return {
                name: (
                  <span
                    className={styles.ContentLink}
                    onClick={() => goToCompanyData(item?._id)}
                  >
                    {item?.name}
                  </span>
                ),
                complexNo: `${item?.complexes?.count} of ${item?.complexLimit}`,
                buildingNo: `${item?.buildings?.count} of ${item?.buildingLimit}`,
                contact: item?.companyAdministrators?.data[0] ? (
                  <div className="flex flex-col items-start">
                    <span>{`${item?.companyAdministrators?.data[0]?.user?.firstName} ${item?.companyAdministrators?.data[0]?.user?.lastName}`}</span>
                    <span className="text-neutral-500 text-sm">
                      {item?.companyAdministrators?.data[0]?.user?.email}
                    </span>
                  </div>
                ) : (
                  'Not available'
                ),
                subscription: 'Not yet available',
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
        showToast('success', 'You have successfully created a company.')
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
        showToast('success', 'You have successfully updated a company.')
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
        showToast('success', 'You have successfully deleted a company.')
        onCancel()
        refetch()
      }
    }
  }, [loadingDelete, calledDelete, dataDelete, errorDelete])

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
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
          data: {
            name: data?.name,
            avatar: data?.logo[0]?.url,
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            },
            complexLimit: data?.complexNo,
            buildingLimit: data?.buildingNo,
            domain: data?.domain
          },
          admin: {
            email: data?.email,
            jobTitle: data?.jobtitle
          }
        }
        await createCompany({ variables: createData })
      } else if (type === 'edit') {
        const updateData = {
          companyId: data?.id,
          data: {
            name: data.name,
            avatar: data?.logo[0],
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            },
            email: data?.email,
            contactNumber: data?.contact !== '' ? data?.contact : null,
            tinNumber: data?.tin !== '' ? data?.tin : null
          }
        }
        await updateCompany({ variables: updateData })
      } else if (type === 'delete') {
        const deleteData = {
          data: {
            companyId: data?._id
          }
        }
        await deleteCompany({ variables: deleteData })
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
        setModalTitle('Add Company')
        setModalData(null)
        break
      }
      case 'edit': {
        setModalTitle('Edit Company')
        setModalData(data)
        break
      }
      case 'delete': {
        setModalTitle('Delete Company')
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
            <img
              alt="logo"
              src={companyProfile?.avatar ?? IMAGES.PROPERTY_AVATAR}
            />
          </div>
          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>{companyProfile?.name ?? ''}</h1>
            <h2 className={styles.PageHeaderSmall}>Company</h2>
          </div>
        </div>

        <div className={styles.PageButton}>
          <Dropdown label={<FaEllipsisH />} items={companyDropdownData} />
        </div>
      </div>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Companies</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <Card
              noPadding
              header={
                <div className={styles.ContentFlex}>
                  <span className={styles.CardHeader}>Companies</span>
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Add Company"
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
              ) : null)}
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default CompanyDataComponent
