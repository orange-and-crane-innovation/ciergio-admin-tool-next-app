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
import moment from 'moment'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import Button from '@app/components/button'
import Uploader from '@app/components/uploader'

import showToast from '@app/utils/toast'

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
  content: yup.mixed().label('Content').nullable(),
  embeddedFiles: yup.array().label('File').nullable().required(),
  category: yup.string().label('Category').nullable().required()
})

const validationSchemaDraft = yup.object().shape({
  title: yup
    .string()
    .nullable()
    .trim()
    .test('len', 'Must be up to 65 characters only', val => val.length <= 65),
  content: yup.mixed(),
  embeddedFiles: yup.array().label('File').nullable(),
  category: yup.string().nullable()
})

const CreatePosts = () => {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)
  const [maxFiles] = useState(3)
  const [files, setFiles] = useState([])
  const [fileUploadedData, setFileUploadedData] = useState([])
  const [fileUrls, setFileUrls] = useState([])
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

  const [
    createPost,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_POST_MUTATION)

  const { handleSubmit, control, reset, errors, register, setValue } = useForm({
    resolver: yupResolver(
      selectedStatus === 'draft' ? validationSchemaDraft : validationSchema
    ),
    defaultValues: {
      title: '',
      content: null,
      category: null,
      embeddedFiles: null
    }
  })

  register({ name: 'embeddedFiles' })

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        showToast('danger', 'Sorry, an error occured during creation of post.')
      }
      if (calledCreate && dataCreate) {
        reset()
        resetForm()
        goToFormsPageLists()
        showToast('success', 'You have successfully created a post.')
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate, reset])

  const goToFormsPageLists = () => {
    push('/forms/')
  }

  const onCountChar = e => {
    if (e.currentTarget.maxLength) {
      setTextCount(e.currentTarget.value.length)
    }
  }

  const uploadApi = async payload => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (response.data) {
      const imageData = response.data.map(item => {
        return {
          url: item.location,
          type: item.mimetype
        }
      })

      setFileUploadedData(imageData)
    }
  }

  const onUploadFile = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length > maxFiles) {
        showToast('info', `Maximum of ${maxFiles} files only`)
      } else {
        setLoading(true)
        for (const file of files) {
          const reader = new FileReader()

          reader.onloadend = () => {
            setFiles(prevArr => [...prevArr, file])
            setFileUrls(prevArr => [...prevArr, reader.result])
            setLoading(false)
          }
          reader.readAsDataURL(file)

          formData.append('photos', file)
          fileList.push(file)
        }
        setValue('embeddedFiles', fileList)

        uploadApi(formData)
      }
    }
  }

  const onRemoveFile = e => {
    const data = fileUrls.filter(item => {
      return item !== e.currentTarget.dataset.id
    })
    setFileUrls(data)
    setValue('embeddedFiles', data.length !== 0 ? data : null)
  }

  const onSubmit = (data, status) => {
    if (
      data?.embeddedFiles === null &&
      data?.title === '' &&
      data?.content === null
    ) {
      showToast('info', `Ooops, it seems like there's no data to be saved.`)
    } else {
      const createData = {
        type: 'form',
        categoryId: data.category,
        title: data?.title || 'Untitled',
        content: data?.content,
        audienceType: selectedAudienceType,
        status: status,
        primaryMedia: fileUploadedData
      }

      if (selectedPublishDateTime) {
        createData.publishedAt = selectedPublishDateTime
      }
      if (selectedCompanySpecific) {
        createData.audienceExpanse = { companyIds: selectedCompanySpecific }
      }
      if (selectedCompanyExcept) {
        createData.audienceExceptions = { companyIds: selectedCompanyExcept }
      }
      if (selectedComplexSpecific) {
        createData.audienceExpanse = { complexIds: selectedComplexSpecific }
      }
      if (selectedComplexExcept) {
        createData.audienceExceptions = { complexIds: selectedComplexExcept }
      }
      if (selectedBuildingSpecific) {
        createData.audienceExpanse = { buildingIds: selectedBuildingSpecific }
      }
      if (selectedBuildingExcept) {
        createData.audienceExceptions = { buildingIds: selectedBuildingExcept }
      }
      createPost({ variables: { data: createData } })
    }
  }

  const onSelectType = data => {
    setSelectedAudienceType(data)
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
    setSelectedCompanySpecific(null)
    setSelectedPublishTimeType('now')
    setSelectedPublishDateTime(null)
    setSelectedStatus('active')
  }

  const onUpdateStatus = data => {
    setSelectedStatus(data)
  }

  return (
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
              <p>You may upload PDFs or DOCs with max file size of 1.5MB.</p>
              <p>Maximum of 3 files only.</p>
              <br />
              <Uploader
                multiple
                files={files}
                fileUrls={fileUrls}
                loading={loading}
                error={errors?.embeddedFiles?.message ?? null}
                maxFiles={maxFiles}
                accept=".pdf, .doc, .docx"
                onUpload={onUploadFile}
                onRemove={onRemoveFile}
              />
            </div>
          }
        />

        <Card
          header={<span className={style.CardHeader}>Publish Details</span>}
          content={
            <div className={style.CreateContentContainer}>
              <div className={style.CreatePostPublishContent}>
                <div className={style.CreatePostPublishSubContent}>
                  <span>
                    Status: <strong>New</strong>
                  </span>
                  <span className="flex flex-col">
                    <div>
                      Audience:
                      <strong>
                        {selectedAudienceType === 'allExcept'
                          ? ' All those registered except: '
                          : selectedAudienceType === 'specific'
                          ? ' Only show to those selected: '
                          : ' All those registered '}
                      </strong>
                      {selectedAudienceType === 'all' && (
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
                      <div className="ml-20">
                        <strong>
                          {selectedCompanyExcept && (
                            <div>{`Companies (${selectedCompanyExcept?.length}) `}</div>
                          )}
                          {selectedCompanySpecific && (
                            <div>{`Companies (${selectedCompanySpecific?.length}) `}</div>
                          )}
                          {selectedComplexExcept && (
                            <div>{`Complexes (${selectedComplexExcept?.length}) `}</div>
                          )}
                          {selectedComplexSpecific && (
                            <div>{`Complexes (${selectedComplexSpecific?.length}) `}</div>
                          )}
                          {selectedBuildingExcept && (
                            <div>{`Buildings (${selectedBuildingExcept?.length}) `}</div>
                          )}
                          {selectedBuildingSpecific && (
                            <div>{`Buildings (${selectedBuildingSpecific?.length}) `}</div>
                          )}
                        </strong>
                        <span
                          className={style.CreatePostLink}
                          onClick={handleShowAudienceModal}
                        >
                          Edit
                        </span>
                      </div>
                    )}
                  </span>
                </div>

                <div className={style.CreatePostPublishMarginContainer}>
                  Publish:
                  <strong>
                    {selectedPublishTimeType === 'later'
                      ? ` Scheduled, ${moment(selectedPublishDateTime).format(
                          'MMM DD, YYYY - hh:mm A'
                        )} `
                      : ' Immediately '}
                  </strong>
                  <span
                    className={style.CreatePostLink}
                    onClick={handleShowPublishTimeModal}
                  >
                    Edit
                  </span>
                </div>
                <span />
              </div>
            </div>
          }
        />

        <div className={style.CreatePostFooter}>
          <Button
            default
            type="button"
            label="Save as Draft"
            className={style.CreatePostFooterButton}
            onMouseDown={() => onUpdateStatus('draft')}
            onClick={handleSubmit(e => {
              onSubmit(e, 'draft')
            })}
          />
          <span>
            <Button
              default
              type="button"
              label="Preview"
              className={style.CreatePostFooterButton}
              onMouseDown={() => onUpdateStatus('draft')}
              onClick={handleSubmit(e => {
                onSubmit(e, 'draft')
              })}
            />
            <Button
              type="button"
              label="Publish Post"
              primary
              onMouseDown={() => onUpdateStatus('active')}
              onClick={handleSubmit(e => {
                onSubmit(e, 'active')
              })}
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
  )
}

export default CreatePosts
