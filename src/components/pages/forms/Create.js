/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import Uploader from '@app/components/uploader'
import PageLoader from '@app/components/page-loader'

import Can from '@app/permissions/can'
import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

import AudienceModal from './components/AudienceModal'
import PublishTimeModal from './components/PublishTimeModal'

import style from './Create.module.css'

const CREATE_POST_MUTATION = gql`
  mutation($data: PostInput) {
    createPost(data: $data) {
      _id
      processId
      message
    }
  }
`
const validationSchema = yup.object().shape({
  title: yup
    .string()
    .label('Title')
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65)
    .required(),
  content: yup.string().label('Content').nullable(),
  embeddedFiles: yup.array().label('File').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65),
  content: yup.mixed().nullable(),
  embeddedFiles: yup.array().label('File').nullable()
})

const CreatePosts = () => {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)
  const [maxFiles] = useState(50)
  const [files, setFiles] = useState([])
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [fileUploadError, setFileUploadError] = useState()
  const [fileUrls, setFileUrls] = useState([])
  const [fileMaxSize] = useState(10000000)
  const [inputMaxLength] = useState(65)
  const [textCount, setTextCount] = useState(0)
  const [showAudienceModal, setShowAudienceModal] = useState(false)
  const [showPublishTimeModal, setShowPublishTimeModal] = useState(false)
  const [selectedAudienceType, setSelectedAudienceType] = useState('all')
  const [selectedCompanyExcept, setSelectedCompanyExcept] = useState()
  const [selectedCompanySpecific, setSelectedCompanySpecific] = useState()
  const [selectedComplexExcept, setSelectedComplexExcept] = useState()
  const [selectedComplexSpecific, setSelectedComplexSpecific] = useState()
  const [selectedBuildingExcept, setSelectedBuildingExcept] = useState()
  const [selectedBuildingSpecific, setSelectedBuildingSpecific] = useState()
  const [selectedPublishTimeType, setSelectedPublishTimeType] = useState('now')
  const [selectedPublishDateTime, setSelectedPublishDateTime] = useState()
  const [selectedStatus, setSelectedStatus] = useState('active')
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id

  const [
    createPost,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_POST_MUTATION, {
    onError: _e => {}
  })

  const { handleSubmit, control, reset, errors, register, setValue } = useForm({
    resolver: yupResolver(
      selectedStatus === 'draft' ? validationSchemaDraft : validationSchema
    ),
    defaultValues: {
      title: '',
      content: null,
      embeddedFiles: null
    }
  })

  register({ name: 'embeddedFiles' })

  useEffect(() => {
    resetAudienceSpecific()
  }, [])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        let message

        reset()
        resetForm()
        goToFormsPageLists()

        switch (selectedStatus) {
          case 'draft':
            message = `You have successfully draft a form.`
            break
          default:
            message = `You have successfully created a form.`
            break
        }

        showToast('success', message)
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate, reset])

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

  const goToFormsPageLists = () => {
    push('/forms/')
  }

  const onCountChar = e => {
    if (e.currentTarget.maxLength) {
      setTextCount(e.currentTarget.value.length)
    }
  }

  const uploadApi = async payload => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'company-id':
          accountType === ACCOUNT_TYPES.SUP.value ? 'oci' : companyID
      }
    }

    await axios
      .post(process.env.NEXT_PUBLIC_UPLOAD_API, payload, config)
      .then(function (response) {
        if (response.data) {
          response.data.map(item => {
            setFileUrls(prevArr => [...prevArr, item.location])
            return setFileUploadedData(prevArr => [
              ...prevArr,
              {
                url: item.location,
                type: item.mimetype
              }
            ])
          })
          setFileUploadError(null)
        }
      })
      .catch(function (error) {
        const errMsg = 'Failed to upload file. Please try again.'
        console.log(error)
        showToast('danger', errMsg)
        setFileUploadError(errMsg)
        setValue('embeddedFiles', null)
      })
      .then(() => {
        setLoading(false)
      })
  }

  const onUploadFile = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      let maxSize = 0
      for (const file of files) {
        if (file.size > fileMaxSize) {
          maxSize++
        }
      }

      if (files.length + fileUrls?.length > maxFiles) {
        showToast('info', `Maximum of ${maxFiles} files only`)
      } else if (maxSize > 0) {
        showToast(
          'info',
          `Maximum size of ${(fileMaxSize / 1024 / 1024).toFixed(1)}mb only`
        )
      } else {
        setLoading(true)
        setFileUploadError(null)

        if (errors?.embeddedFiles?.message) {
          errors.embeddedFiles.message = null
        }

        for (const file of files) {
          const reader = new FileReader()
          reader.readAsDataURL(file)

          formData.append('files', file)
          fileList.push(file)
        }
        setValue('embeddedFiles', fileList)

        uploadApi(formData)
      }
    }
  }

  const onRemoveFile = e => {
    const files = fileUrls.filter(item => {
      return item !== e.currentTarget.dataset.id
    })
    const uploadedFiles = fileUploadedData.filter(image => {
      return image.url !== e.currentTarget.dataset.id
    })
    setFileUrls(files)
    setFileUploadedData(uploadedFiles)
    setValue('embeddedFiles', files.length !== 0 ? files : null)
  }

  const onSubmit = (data, status) => {
    if (
      data?.embeddedFiles === null &&
      data?.title === '' &&
      (data?.content === null || data?.content === '')
    ) {
      showToast('info', `Ooops, it seems like there's no data to be saved.`)
    } else {
      const createData = {
        type: 'form',
        title: data?.title || 'Untitled',
        content:
          data?.content === ''
            ? null
            : data?.content?.replace(/(&nbsp;)+/g, ''),
        audienceType: selectedAudienceType,
        status: status,
        primaryMedia: fileUploadedData
      }

      if (selectedPublishDateTime) {
        createData.publishedAt = selectedPublishDateTime
      }
      if (selectedCompanySpecific) {
        createData.audienceExpanse = {
          companyIds: selectedCompanySpecific.map(item => item.value)
        }
      }
      if (selectedCompanyExcept) {
        createData.audienceExceptions = {
          companyIds: selectedCompanyExcept.map(item => item.value)
        }
      }
      if (selectedComplexSpecific) {
        createData.audienceExpanse = {
          complexIds: selectedComplexSpecific.map(item => item.value)
        }
      }
      if (selectedComplexExcept) {
        createData.audienceExceptions = {
          complexIds: selectedComplexExcept.map(item => item.value)
        }
      }
      if (selectedBuildingSpecific) {
        createData.audienceExpanse = {
          buildingIds: selectedBuildingSpecific.map(item => item.value)
        }
      }
      if (selectedBuildingExcept) {
        createData.audienceExceptions = {
          buildingIds: selectedBuildingExcept.map(item => item.value)
        }
      }
      createPost({ variables: { data: createData } })
    }
  }

  const onSelectType = data => {
    setSelectedAudienceType(data)

    if (data === 'all') {
      resetAudienceSpecific()
    }
  }

  const onSelectCompanyExcept = data => {
    setSelectedCompanyExcept(data)
  }

  const onSelectCompanySpecific = data => {
    setSelectedCompanySpecific(data)
  }

  const onSelectComplexExcept = data => {
    setSelectedComplexExcept(data)
  }

  const onSelectComplexSpecific = data => {
    setSelectedComplexSpecific(data)
  }

  const onSelectBuildingExcept = data => {
    setSelectedBuildingExcept(data)
  }

  const onSelectBuildingSpecific = data => {
    setSelectedBuildingSpecific(data)
  }

  const handleShowAudienceModal = () => {
    setShowAudienceModal(old => !old)
  }

  const onSaveAudience = () => {
    handleShowAudienceModal()
  }

  const onCancelAudience = () => {
    setSelectedAudienceType('all')
    setSelectedCompanyExcept(null)
    setSelectedCompanySpecific(null)
    handleShowAudienceModal()
  }

  const handleShowPublishTimeModal = () => {
    setShowPublishTimeModal(old => !old)
  }
  const onSelectPublishTimeType = data => {
    setSelectedPublishTimeType(data)
  }

  const onSelectPublishDateTime = data => {
    setSelectedPublishDateTime(data)
  }

  const onSavePublishTime = () => {
    handleShowPublishTimeModal()
  }

  const onCancelPublishTime = () => {
    setSelectedPublishDateTime(new Date())
    setSelectedPublishTimeType('now')
    handleShowPublishTimeModal()
  }

  const resetForm = () => {
    setLoading(false)
    setFileUrls([])
    setFileUploadedData([])
    setTextCount(0)
    setShowAudienceModal(false)
    setShowPublishTimeModal(false)
    setSelectedAudienceType('all')
    setSelectedCompanyExcept(null)
    setSelectedComplexExcept(null)
    setSelectedBuildingExcept(null)
    setSelectedPublishTimeType('now')
    setSelectedPublishDateTime(null)
    setSelectedStatus('active')
    resetAudienceSpecific()
  }

  const resetAudienceSpecific = () => {
    if (accountType === ACCOUNT_TYPES.COMPYAD.value) {
      const companyID = user?.accounts?.data[0]?.company?._id
      setSelectedCompanySpecific([{ value: companyID }])
      setSelectedComplexSpecific(null)
      setSelectedBuildingSpecific(null)
    } else if (accountType === ACCOUNT_TYPES.COMPXAD.value) {
      const complexID = user?.accounts?.data[0]?.complex?._id
      setSelectedComplexSpecific([{ value: complexID }])
      setSelectedCompanySpecific(null)
      setSelectedBuildingSpecific(null)
    } else if (accountType === ACCOUNT_TYPES.BUIGAD.value) {
      const buildingID = user?.accounts?.data[0]?.building?._id
      setSelectedBuildingSpecific([{ value: buildingID }])
    } else if (accountType === ACCOUNT_TYPES.RECEP.value) {
      const buildingID = user?.accounts?.data[0]?.building?._id
      setSelectedBuildingSpecific([{ value: buildingID }])
      setSelectedCompanySpecific(null)
      setSelectedComplexSpecific(null)
    }
  }

  const onUpdateStatus = data => {
    setSelectedStatus(data)
  }

  return (
    <>
      {loadingCreate && <PageLoader fullPage />}
      <div className={style.CreatePostContainer}>
        <h1 className={style.CreatePostHeader}>Upload a Form</h1>
        <form>
          <Card
            content={
              <div className={style.CreateContentContainer}>
                <h2 className={style.CreatePostHeaderSmall}>Title</h2>
                <div className={style.CreatePostSubContent}>
                  <div className={style.CreatePostSubContentGrow}>
                    <Controller
                      name="title"
                      control={control}
                      render={({ name, value, onChange }) => (
                        <FormInput
                          inputClassName={style.CreatePostInputCustom}
                          type="text"
                          name={name}
                          value={value}
                          placeholder="What's the title of your download form?"
                          maxLength={inputMaxLength}
                          count={textCount}
                          error={errors?.title?.message ?? null}
                          onChange={e => {
                            onChange(e)
                            onCountChar(e)
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className={style.CreatePostCounter}>
                    {textCount}/{inputMaxLength}
                  </div>
                </div>
                <h2 className={style.CreatePostHeaderSmall}>Description</h2>
                <Controller
                  name="content"
                  control={control}
                  render={({ name, value, onChange }) => (
                    <FormTextArea
                      maxLength={500}
                      options={['history']}
                      placeholder="(Optional) You may add additional notes here"
                      withCounter
                      stripHtmls
                      value={value}
                      error={errors?.content?.message ?? null}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
            }
          />

          <Card
            header={<span className={style.CardHeader}>Files</span>}
            content={
              <div className={style.CreateContentContainer}>
                <p>
                  You may upload PDFs or DOCs with max file size of{' '}
                  {(fileMaxSize / 1024 / 1024).toFixed(1)}MB.
                </p>
                <p>Maximum of {maxFiles} files only.</p>
                <br />
                <Uploader
                  multiple
                  files={fileUploadedData}
                  fileUrls={fileUrls}
                  loading={loading}
                  error={
                    errors?.embeddedFiles?.message ?? fileUploadError ?? null
                  }
                  maxFiles={maxFiles}
                  accept=".pdf, .doc, .docx"
                  onUpload={onUploadFile}
                  onRemove={onRemoveFile}
                />
              </div>
            }
          />

          <Card
            header={<span className={style.CardHeader}>Publish Detailss</span>}
            content={
              <div className={style.CreateContentContainer}>
                <div className={style.CreatePostPublishContent}>
                  <div className={style.CreatePostPublishSubContent}>
                    <span className="flex">
                      <span className={style.CreatePostSection}>Status: </span>
                      <strong>New</strong>
                    </span>
                    <span className="flex flex-col">
                      <div className="flex">
                        <span className={style.CreatePostSection}>
                          Audience:{' '}
                        </span>
                        <span className="mr-2">
                          <strong>
                            {selectedAudienceType === 'allExcept'
                              ? ' All those registered except: '
                              : selectedAudienceType === 'specific'
                              ? ' Only show to those selected: '
                              : ' All those registered '}
                          </strong>
                        </span>

                        {(systemType === 'home' ||
                          (systemType !== 'home' &&
                            accountType !== ACCOUNT_TYPES.COMPXAD.value)) && (
                          <span
                            className={style.CreatePostLink}
                            onClick={handleShowAudienceModal}
                          >
                            Edit
                          </span>
                        )}
                      </div>

                      {(selectedAudienceType === 'allExcept' ||
                        selectedAudienceType === 'specific') && (
                        <div className="flex">
                          <span className={style.CreatePostSection} />
                          <span>
                            <strong>
                              {accountType !== ACCOUNT_TYPES.COMPYAD.value && (
                                <>
                                  {selectedCompanyExcept && (
                                    <div>{`Companies (${selectedCompanyExcept?.length}) `}</div>
                                  )}
                                  {selectedCompanySpecific && (
                                    <div>{`Companies (${selectedCompanySpecific?.length}) `}</div>
                                  )}
                                </>
                              )}

                              {accountType !== ACCOUNT_TYPES.COMPXAD.value && (
                                <>
                                  {selectedComplexExcept && (
                                    <div>{`Complexes (${selectedComplexExcept?.length}) `}</div>
                                  )}
                                  {selectedComplexSpecific && (
                                    <div>{`Complexes (${selectedComplexSpecific?.length}) `}</div>
                                  )}
                                </>
                              )}

                              {accountType !== ACCOUNT_TYPES.BUIGAD.value && (
                                <>
                                  {selectedBuildingExcept && (
                                    <div>{`Buildings (${selectedBuildingExcept?.length}) `}</div>
                                  )}
                                  {selectedBuildingSpecific && (
                                    <div>{`Buildings (${selectedBuildingSpecific?.length}) `}</div>
                                  )}
                                </>
                              )}
                            </strong>
                          </span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          <div className={style.CreatePostFooter}>
            <Can
              perform="forms:draft"
              yes={
                <Button
                  default
                  type="button"
                  label="Save as Draft"
                  className={style.CreatePostFooterButton}
                  onMouseDown={() => onUpdateStatus('draft')}
                  onClick={handleSubmit(e => {
                    onSubmit(e, 'draft')
                  })}
                  loading={loading}
                  disabled={loading}
                />
              }
              no={
                <Button type="button" label="Save as Draft" primary disabled />
              }
            />
            <span>
              <Can
                perform="forms:create"
                yes={
                  <Button
                    type="button"
                    label="Publish Form"
                    primary
                    onMouseDown={() => onUpdateStatus('active')}
                    onClick={handleSubmit(e => {
                      onSubmit(e, 'active')
                    })}
                    loading={loading}
                    disabled={loading}
                  />
                }
                no={
                  <Button type="button" label="Publish Form" primary disabled />
                }
              />
            </span>
          </div>
        </form>

        <AudienceModal
          onSelectAudienceType={onSelectType}
          onSelectCompanyExcept={onSelectCompanyExcept}
          onSelectCompanySpecific={onSelectCompanySpecific}
          onSelectComplexExcept={onSelectComplexExcept}
          onSelectComplexSpecific={onSelectComplexSpecific}
          onSelectBuildingExcept={onSelectBuildingExcept}
          onSelectBuildingSpecific={onSelectBuildingSpecific}
          onSave={onSaveAudience}
          onCancel={onCancelAudience}
          onClose={onCancelAudience}
          isShown={showAudienceModal}
          valueAudienceType={selectedAudienceType}
          valueCompanyExcept={selectedCompanyExcept}
          valueCompanySpecific={selectedCompanySpecific}
          valueComplexExcept={selectedComplexExcept}
          valueComplexSpecific={selectedComplexSpecific}
          valueBuildingExcept={selectedBuildingExcept}
          valueBuildingSpecific={selectedBuildingSpecific}
        />

        <PublishTimeModal
          onSelectType={onSelectPublishTimeType}
          onSelectDateTime={onSelectPublishDateTime}
          onSave={onSavePublishTime}
          onCancel={onCancelPublishTime}
          onClose={onCancelPublishTime}
          isShown={showPublishTimeModal}
          valuePublishType={selectedPublishTimeType}
          valueDateTime={selectedPublishDateTime}
        />
      </div>
    </>
  )
}

export default CreatePosts
